import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoMdStar } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { Pagination } from 'antd'


function SearchList() {

  const navigator = useNavigate()

  const {state} = useLocation()
  const [page,setpage] = useState(1) 
  const [datas,setdatas] = useState([]) 
  const [pagination,setpagination] = useState({}) 


  useEffect(()=>{
    getmovie()
  },[state])

  async function getmovie(){
    const response =  await axios.get(`${process.env.REACT_APP_BACKEND_URL}movie/search?text=${state}&page=${page}`)
    setdatas(response?.data?.datas)
    setpagination(response?.data?.pagination)
  }

  return (
    <div className='bg-black text-white py-10'>

<div className='py-10'>
            <h6 className='text-[#0ba9d9] text-[11px] font-[800] text-center'>Related MOVIES</h6>
            <h6 className='text-[#fff] font-bold text-[25px]  text-center'>Movie listed Based on Your Search</h6>
        </div>
       
       <div className='w-[80%] mx-auto'>
        <h6 className='text-[12px]'>Movies Found ({pagination?.total})</h6>

        <div className='grid mt-10 gap-4 pb-10 mx-auto grid-cols-6'>
            {datas?.map((d)=>(
            <div className='text-white bg-[#333333] rounded overflow-hidden' onClick={()=>navigator('/detail',{state:d})} >
            <img alt="img" className='w-[100%] h-[180px] object-cover'  src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${d?.image}`} />
            <h6 className='px-2 capitalize text-[11px] flex items-center my-1'><IoMdStar size={18} color='#fceb26' className='mr-1' /> {d?.rating}</h6>
            <h6 className='px-2 capitalize text-[13px]'>{d?.title}</h6>

            <div className='flex text-[#0ba9d9] bg-black items-center justify-center w-[96%] p-[4px] mx-auto my-[5px] rounded'>
               <FaPlay size={12} />
               <h6 className='ml-2 text-[13px]'>View Detail</h6>  
            </div> 
            </div> 
            ))}
             
        </div>


        <div className='flex items-center justify-center my-10'>
            <Pagination total={pagination?.total} size='small' onChange={(v)=>setpage(v)} pageSize={pagination?.limit} />
        </div>
        
        </div>
    </div>
  )
}

export default SearchList