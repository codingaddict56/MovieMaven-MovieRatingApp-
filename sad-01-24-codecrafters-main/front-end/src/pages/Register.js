import React, { useState } from 'react';
import axios from 'axios';
import { BiCameraMovie } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const Register = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userTypeId = 2;
  const navigator = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const newUser = { username, password, email, userTypeId };

    axios.post('http://localhost:4000/users/register', newUser)
      .then(response => {
        console.log(response.data);
        const { userId, username, profilePicture } = response.data;
        setSuccess('User registered and logged in successfully!'); // Set success message
        
        // Call the handleLogin function to update the app state
        handleLogin(userId, username, profilePicture);
        
        // Redirect to the home page 
        navigator('/', { state: { userId, username, profilePicture } });
      })
      .catch(error => {
        console.error(error);
        setError(error.response ? error.response.data : 'Error occurred');
        setSuccess(''); // Clear success message on error
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/users/auth/google';
  };

  return (
    <div className='flex flex-col my-5 items-center justify-center'>
      <h1 className='font-bold text-[20px] flex items-center'><BiCameraMovie size={20} className='mr-[5px]' /> Movie  <span className='text-[#0ba9d9]'>Maven</span></h1>
      <div className='border rounded py-5 px-4 mt-4 w-[22%]'>
        <h6 className='text-[22px] mb-4 text-gray-800'>Create account</h6>
        <h6 className='text-[13px] font-[400] mb-[5px]'>Username</h6>
        <input
          type="text"
          className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1'
          placeholder="" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <h6 className='text-[13px] font-[400] mb-[5px]'>Email</h6>
        <input
          type="text"
          className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1'
          placeholder="" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h6 className='text-[13px] font-[400] mb-[5px]'>Password</h6>
        <input
          type="password"
          className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1'
          placeholder="" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <h6 className='text-[13px] font-[400] mb-[5px]'>Re-enter password</h6>
        <input
          type="password"
          className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1'
          placeholder=""
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className='bg-[#0ba9d9] w-[100%] p-1 font-bold text-white rounded' onClick={handleSubmit}>Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
      <h6 className='mt-3 text-[12px]'>Already have an account? <span onClick={() => navigator('/login')} className='text-[#0ba9d9] underline font-bold cursor-pointer'>Login Now</span> </h6>
    </div>
  )
}

export default Register;
