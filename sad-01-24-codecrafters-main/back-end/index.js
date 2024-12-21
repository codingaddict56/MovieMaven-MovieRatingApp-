const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))


const port = 4000
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// router 
const movieRouter = require('./routes/movie.router')
const moviereviewRouter = require('./routes/moviereview.router')
const notificationRouter = require('./routes/notifcation.router')
const usersRouter = require('./routes/users')

// var http = require('http');
//create a server object:


// mongoose.connect('mongodb://localhost/movie_backend', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })


app.use('/api/movie',movieRouter)
app.use('/api/movie_review',moviereviewRouter)
app.use('/api/notification',notificationRouter)
app.use('/users',usersRouter)
app.use('/users',usersRouter)

app.get('/', (req, res) => {
    res.send('Backend Running!')
})
  
// Enable CORS for Google authentication callback route
app.use('/users/auth/google/callback', cors());

app.listen(port, () => {
console.log(`Express app listening on port ${port}`)
})