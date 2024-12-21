const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
let User = require('../models/User');
let Poll = require('../models/Poll');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cors = require('cors');

// Initialize passport
router.use(session({ secret: 'secret_key', resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// In your backend routes file
router.get('/polls', async (req, res) => {
  try {
    const polls = await Poll.find(); // Assuming you have a Poll model
    res.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ message: 'Error fetching polls' });
  }
});

// POST: Register a new user
router.post('/register', async(req, res) => {
  const { username, password, email, userTypeId } = req.body;

  if (!username || !password || !email ) {
    return res.status(400).json('Error: Missing username, email or password');
  }
  if (password.length < 6) {
    return res.status(400).json('Error: Password must be at least 6 characters long');
  }
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  if (!validateEmail(email)) {
    return res.status(400).json('Error: Please ensure email address is in the correct format');
  }
  try {
    // Check for duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json('Error: Username already exists');
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json('Error: An account exists with this email');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email, userTypeId});

    await newUser.save();

    // Log in the user after registration
    req.login(newUser, (err) => {
      if (err) {
        return res.status(400).json('Error: ' + err.message);
      }
      // Return user data after successful login
      res.json({
        userId: newUser._id,
        username: newUser.username,
        profilePicture: newUser.profilePicture,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json('Error: ' + err.message);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:4000/users/auth/google/callback'
},
async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.emails[0].value,
        email: profile.emails[0].value,
        userTypeId: 2
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Routes for Google authentication
router.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] // Include required scope parameter
  })
);

// Route for handling Google authentication callback
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login' 
  }),
  async (req, res) => {
    // After successful authentication, redirect to a route that returns the user data
    res.redirect('http://localhost:4000/users/auth/google/success');
  }
);

// Route for returning user data after successful Google authentication
router.get('/auth/google/success', async (req, res) => {
  
  const user = req.user;
  if (!user) {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.emails[0].value,
        email: profile.emails[0].value,
        userTypeId: 2
      });
      await user.save();
    }
    return done(null, user);
  } else {
    try {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.redirect(`http://localhost:3000/login?token=${token}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// GET: Fetch user profile
router.get('/me', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId).select('username profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST: Login
router.post('/login', async (req, res) => {
  const { username, password, googleId } = req.body;

  try {
    if (googleId) {
      // If googleId is provided, find the user by googleId
      const user = await User.findOne({ googleId });

      if (!user) {
        return res.status(401).json('User not found');
      }

      // Return user data
      res.json({ userId: user._id, profilePicture: user.profilePicture });
    } else {
      // If googleId is not provided, proceed with username and password authentication
      const user = await User.findOne({ username });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json('Invalid username or password');
      }

      res.json({ userId: user._id, profilePicture: user.profilePicture });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Internal Server Error');
  }
});

// PUT: Update user profile
router.put('/update', upload.single('profilePicture'), async (req, res) => {
  try {
    //const userId = req.params.userId; // Get userId from request params
    const { userId, username } = req.body;

    let updateData = {}; // Initialize an empty object to hold update data

    // If profilePicture is uploaded, add its path to updateData
    if (req.file) {
      updateData.profilePicture = req.file.path.replace(/\\/g, '/');
    }

    // If username is provided, add it to updateData
    if (username) {
      updateData.username = username;
    }

    // Update the user profile using userId
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Create a new poll
router.post('/create', async (req, res) => {
  const { title, options, userId } = req.body;

  if (!title || !options || options.length < 2) {
    return res.status(400).json('Error: Poll must have a title and at least two options.');
  }

  try {
    const newPoll = new Poll({ title, options, userId });
    await newPoll.save();
    res.json('Poll created!');
  } catch (err) {
    console.error(err);
    res.status(400).json('Error: ' + err.message);
  }
});

// Route to vote on a poll
router.post('/polls/:pollId/vote', async (req, res) => {
  const { pollId } = req.params;
  const { userId, optionIndex } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    } 

    if (poll.voters.includes(userId)) {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    }

    poll.options[optionIndex].votes += 1;
    poll.voters.push(userId);
    await poll.save();

    res.json(poll);
  } catch (error) {
    console.error('Error voting on poll:', error);
    res.status(500).json({ message: 'Error voting on poll' });
  }
});

// GET: Fetch user profile
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;