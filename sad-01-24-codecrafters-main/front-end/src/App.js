import React, { useState, useEffect } from 'react';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SearchList from './pages/SearchList';
import Login from './pages/Login';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import ViewPolls from './pages/ViewPolls';
import CreatePoll from './pages/CreatePoll';
import MovieList from './pages/admin/MovieList';
import MovieCE from './pages/admin/MovieCE';
import ReviewList from './pages/admin/ReviewList';
import ReviewCE from './pages/admin/ReviewCE';
import axios from 'axios';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);
  
  const handleLogin = (id, name, profilePicture) => {
    setIsLoggedIn(true);
    setUserId(id);
    setUsername(name);
    setProfilePicture(profilePicture);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername('');
    setProfilePicture('');
  }

  const fetchUserData = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    try {
      const response = await axios.get(`http://localhost:4000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Add Authorization header
        },
      });
      const { username, profilePicture } = response.data;
      setUsername(username);
      setProfilePicture(profilePicture);
      setUserId(userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error, e.g., log out user if token is invalid
      handleLogout();
    }
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <Home isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} /> 
          <Footer/>
        </div>
      ),
    },
    {
      path: "/search",
      element: (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <SearchList /> 
          <Footer/>
        </div>
      ),
    },
    {
      path: "/detail",
      element: (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <MovieDetail /> 
          <Footer/>
        </div>
      ),
    },
    {
      path: "/login",
      element: !isLoggedIn ? (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <Login handleLogin={handleLogin} />
          <Footer />
        </div>
      ) : <Navigate to="/" />,
    },
    {
      path: "/register",
      element: !isLoggedIn ? (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <Register handleLogin={handleLogin} />
          <Footer />
        </div>
      ) : <Navigate to="/" />,
    },
    {
      path: "/logout",
      element: !isLoggedIn ? (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <Login handleLogin={handleLogin} />
          <Footer />
        </div>
      ) : <Navigate to="/" />,
    },
    {
      path: "/update",
      element: isLoggedIn ? (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <UserManagement username={username} userId={userId} updateUserData={fetchUserData} />
          <Footer />
        </div>
      ) : <Navigate to="/login" />,
    },
    {
      path: "/view-poll",
      element: isLoggedIn ? (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <ViewPolls userId={userId} />
          <Footer />
        </div>
      ) : <Navigate to="/login" />,
    },
    {
      path: "/createPoll",
      element: isLoggedIn ? (
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} profilePicture={profilePicture} />
          <CreatePoll userId={userId} />
          <Footer />
        </div>
      ) : <Navigate to="/login" />,
    },
    {
      path: "/admin/movie",
      element: (
        <div>
          <MovieList /> 
        </div>
      ),
    },
    {
      path: "/admin/movie/:type",
      element: (
        <div>
          <MovieCE /> 
        </div>
      ),
    },
    {
      path: "/admin/review",
      element: (
        <div>
          <ReviewList /> 
        </div>
      ),
    },
    {
      path: "/admin/review/:type",
      element: (
        <div>
          <ReviewCE /> 
        </div>
      ),
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
