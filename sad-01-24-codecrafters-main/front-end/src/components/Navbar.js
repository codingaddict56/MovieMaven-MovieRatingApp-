import React, { useState } from 'react';
import { BiSolidBookmarkPlus } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";
import { BiCameraMovie } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, handleLogout, profilePicture }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const defaultProfilePicture = "uploads/default_profile_picture.png";
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className='cursor-pointer flex px-[10%] text-white p-[15px] items-center bg-[#121212] ' style={{ zIndex: 100 }}>
      <h1 className='font-bold flex items-center'><BiCameraMovie size={20} className='mr-[5px]' /> Movie  <span className='text-[#0ba9d9]'>Maven</span></h1>

      <div className='relative' style={{ zIndex: 100 }}>
        <h6 
          className='text-[14px] font-[600] hover:bg-gray-800 duration-300 px-4 py-1 rounded ml-3 mr-1 flex items-center cursor-pointer'
          onClick={toggleDropdown}
        >
          <IoMenu size={20} className='mr-[5px]' /> 
          <span>Menu</span>
        </h6>
        {dropdownVisible && (
          <nav className='absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md'>
            <ul>
              <li className='hover:bg-gray-200'>
                <Link to="/view-poll" className='block px-4 py-2 text-black'>
                  Polls
                </Link>
              </li>
              <li className='hover:bg-gray-200'>
                <Link to="/update" className='block px-4 py-2 text-black'>
                  Profile
                </Link>
              </li>
              {/* Add other menu items here */}
            </ul>
          </nav>
        )}
      </div>

      <div className='w-[50%] ml-2 relative'>
        <input className='w-[100%] py-[5px] focus:outline-none rounded placeholder:text-[13px] pl-2 text-black' placeholder='Search Movie ...' type="text" />
        <IoSearch className='absolute right-[15px] top-[10px] text-gray-600' />
      </div>

      <div className='flex items-center'>
        <h6 className='text-[14px] font-[600] hover:bg-gray-800 duration-300 px-4 py-1 rounded ml-3 mr-2 flex items-center'>
          <BiSolidBookmarkPlus size={20} className='mr-[5px]' /> 
          <span>WatchList</span>
        </h6>
        <h6 className='w-[2px] h-[15px] bg-white'></h6>
        {isLoggedIn ? (
          <h6 className='text-[14px] font-[600] hover:bg-gray-800 duration-300 px-4 py-1 rounded mx-2'>
            <Link to="/logout" onClick={handleLogout}>Logout</Link>
          </h6>
        ) : (
          <h6 className='text-[14px] font-[600] hover:bg-gray-800 duration-300 px-4 py-1 rounded mx-2'>
            <Link to="/login">Login</Link>
          </h6>
        )}
      </div>
    </div>
  );
}

export default Navbar;
