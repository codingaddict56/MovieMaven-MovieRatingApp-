import React, { useState, useEffect } from 'react';
import { BiCameraMovie } from "react-icons/bi";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigator = useNavigate()
    
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
  
    if (token) {
      // Store token in local storage or state
      localStorage.setItem('token', token);
  
      // Fetch user data using the token
      fetchUserData(token);
    }
  }, [location]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:4000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const { _id, username, profilePicture } = response.data;
      handleLogin(_id, username, profilePicture);
      navigator('/', { state: { username, _id, profilePicture } });
    } catch (error) {
      console.error(error);
      setError('Failed to fetch user data');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/users/auth/google';
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {

      const response = await axios.post('http://localhost:4000/users/login', { username, password });
    
      // Check if response contains userId
      const { data } = response;
      if (!data || !data.userId) {
        throw new Error('Invalid response from server');
      }
      const { userId, profilePicture } = data;
      
      // Call the handleLogin function to update the app state
      handleLogin(userId, username, profilePicture);

      // Redirect to the home page 
      navigator('/', { state: { username, userId, profilePicture } });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError(error.response ? error.response.data.message : 'Error occurred');
      }
    }
  }
  const handleRegister = () => {
    navigator('/register');
  };

  return (
    <div className='flex flex-col my-5 items-center justify-center'>
        <h1 className='font-bold text-[20px] flex items-center'><BiCameraMovie size={20} className='mr-[5px]' /> Movie  <span className='text-[#0ba9d9]'>Maven</span></h1>
        <div className='border rounded py-5 px-4 mt-4 w-[22%]'>
            <h6 className='text-[22px] mb-4 text-gray-800'>Login To Your account</h6>
            <h6 className='text-[13px] font-[400] mb-[5px]'>Username</h6>
            <input
              type="text"
              className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1'
              placeholder="" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h6 className='text-[13px] font-[400] mb-[5px]'>Password</h6>
            <input
              type="password"
              className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1'
              placeholder="" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit} className='bg-[#0ba9d9] w-[100%] p-1 font-bold text-white rounded'>Login</button>
            <p>  or  </p>
            <button onClick={handleGoogleLogin} className="register-button-half">
              <span className="google-icon"></span>
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <h6 className='mt-3 text-[12px]'>Don't have an account? <span onClick={()=>navigator('/register')} className='text-[#0ba9d9] underline font-bold cursor-pointer'>Register Now</span> </h6>
    </div>
  )
}

export default Login