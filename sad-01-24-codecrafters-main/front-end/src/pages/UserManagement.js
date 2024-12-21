import React, { useState } from 'react';
import axios from 'axios';

const UserManagement = ({ username: currentUsername, userId, updateUserData }) => {
  const [newUsername, setNewUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', userId);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    if (newUsername) {
      formData.append('username', newUsername);
    }

    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    try {
      const response = await axios.put('http://localhost:4000/users/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Add Authorization header
        },
      });

      console.log(response.data);
      setProfilePicture(null);
      setNewUsername(''); // Clear the new username field
      setError(''); // Clear error message on success
      setSuccess('Profile updated successfully!'); // Set success message
      
      // Fetch updated user data and update the state in the parent component
      updateUserData();
    } catch (error) {
      console.error(error);
      setError(error.response && error.response.data ? error.response.data.message : 'Error occurred');
      setSuccess(''); // Clear success message on error
    }
  };

  return (
    <div className='flex flex-col my-5 items-center justify-center'>
      <h2 className="register-title">Current Username: {currentUsername}</h2>
      <div className="border rounded py-5 px-4 mt-4 w-[22%]">
        <h6 className='text-[13px] font-[400] mb-[5px]'>New Username</h6>
        <input
          type="text"
          className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1'
          placeholder="" 
          value={newUsername}
          onChange={handleUsernameChange}
        />
        <h6 className='text-[13px] font-[400] mb-[5px]'>Update Profile Picture</h6>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button onClick={handleSubmit} type="submit" className='bg-[#0ba9d9] w-[100%] p-1 font-bold text-white rounded'>Update</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>} {/* Display success message */}
      </div>
    </div>
  );
};

export default UserManagement;