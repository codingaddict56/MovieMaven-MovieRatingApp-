import { message } from 'antd'
import axios from 'axios'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function AddMyPoll() {
  
  const {state} = useLocation()
  const userId = localStorage.getItem('userId')
  const navigator = useNavigate()


  async function applymypollvote(i){

    let data = {
      userId:userId,
      optionIndex:i
    }
    try{
      const response =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}users/polls/${state?._id}/vote`,data)
      if(response.status === 200){
        message.success("Poll Vote added successfully!")
        navigator(-1)
      }
    }catch(e){
      message.error(e?.response?.data?.message)
      navigator(-1)
    }
  }
  
  
  return (
    <div className='wrap border p-4'>

        <div>
            <h6 className='text-[14px] font-[600]'>Title : {state?.title}</h6>

            <div className='border-l mt-2 border-b border-r'>
            {state?.options?.map((d)=>(
              <div className='border-t'>
                 <h6 className='capitalize text-[13px] p-1'>{d?.text}  Vote Count : <span className='font-[800]'>{d?.votes}</span></h6>
              </div>  
            ))}
            </div>
            
            <div className='flex mt-2 flex-wrap'>
            {state?.options?.map((d,i)=>(
            <div onClick={()=>applymypollvote(i)}>
              <h6 className='capitalize px-4 cursor-pointer bg-[#0ba9d9] font-[700] mr-[4px] text-[13px] p-1'>{d?.text}</h6>
            </div>))}
            </div>
        </div>

    </div>
  )
}

export default AddMyPoll