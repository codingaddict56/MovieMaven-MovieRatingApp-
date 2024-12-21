import React from 'react'
import { BiCameraMovie } from "react-icons/bi";
import { TbUserScan } from "react-icons/tb";
import { MdOutlineRateReview } from "react-icons/md";



function DashboardMenu() {
  return (
    <div className='w-44 bg-black min-h-screen text-white'>

        <h1 className='font-bold border-b p-2 border-gray-700 text-[20px] flex items-center'><BiCameraMovie size={20} className='mr-[5px]' /> Movie  <span className='text-[#0ba9d9]'>Maven</span></h1>
        
        <div className='mt-5'>
            <div className='flex py-2 border-b border-gray-700 cursor-pointer opacity-70 px-4 text-[13px] items-center'>
                <BiCameraMovie size={18} /> 
                <h6 className='ml-2'>Movie List</h6>
            </div>

            <div className='flex py-2 border-b border-gray-700 cursor-pointer opacity-70 px-4 text-[13px] items-center'>
                <MdOutlineRateReview size={18} /> 
                <h6 className='ml-2'>Review List</h6>
            </div>

            <div className='flex py-2 border-b border-gray-700 cursor-pointer opacity-70 px-4 text-[13px] items-center'>
                <TbUserScan size={18} /> 
                <h6 className='ml-2'>Users List</h6>
            </div>
        </div>

    </div>
  )
}

export default DashboardMenu