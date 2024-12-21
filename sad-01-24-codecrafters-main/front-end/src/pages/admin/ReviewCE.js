import React, { useEffect, useState } from 'react'
import { Rate,message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import DashboardMenu from './DashboardMenu'

function ReviewCE() {

  const navigator = useNavigate()  

  const {state} = useLocation()

  const [data,setdata] = useState({ratings:'',title:'',summary:''})  
  const [error,seterror] = useState({ratings:'',title:'',summary:''}) 
  

  useEffect(()=>{
     if(state?._id !== undefined){
      setdata({
        ratings:state?.ratings,
        title:state?.title,
        summary:state?.summary
      })
     }
  },[state])

  function handlechange(e){
    setdata({...data,[e.target.name]:e.target.value})
    seterror({...error,[e.target.name]:''})
  }

 
  async function goBack(){
    navigator(-1)
  }

  async function submitForm(){
    const header = {headers:{
        'Content-Type': 'application/json',
    }}   

    if(state?._id !== undefined){
      const response =  await axios.put(`${process.env.REACT_APP_BACKEND_URL}movie_review/update/${state?._id}`,data,header)
      if(response.status === 200){
          message.success("Movie Review Updated Successfully!",1.5)
          resetform()
          navigator(-1)
      }
    }else{
      const response =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}movie_review/create`,data,header)
      if(response.status === 201){
          message.success("Movie Review Created Successfully!",1.5)
          resetform()
      }
    }
  }

  function resetform(){
    setdata({ratings:'',title:'',summary:''})
    seterror({ratings:'',title:'',summary:''})
  }

  return (
    <div className='flex'>
 
       <div className='min-w-44 max-w-44'>
          <DashboardMenu />
        </div>
        <div className='p-4 w-[100%]'>
            <div className='w-60'>
                <h6>Update the Review Added by the User</h6>

                <h6 className='text-[13px] mt-2 font-[400] mb-[5px]'>Rating</h6>
                <Rate value={data?.ratings} onChange={(v)=>setdata({...data,ratings:v})} count={10}/>

                <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Title</h6>
                <textarea type='text' name={'title'} value={data?.title} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />

                <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Summary</h6>
                <textarea type='text' name={'summary'} value={data?.summary} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />

                <div className='mt-4 -ml-2'>
                    <button className='bg-slate-200 p-1 px-3 ml-2 font-[800] text-[13px] rounded' onClick={goBack}>Cancel</button>
                    <button className='bg-[#0ba9d9] p-1 px-3 ml-2 font-[800] text-[13px] rounded' onClick={submitForm}>Submit</button>
                </div>

            </div>    
        </div>
    </div>
  )
}

export default ReviewCE