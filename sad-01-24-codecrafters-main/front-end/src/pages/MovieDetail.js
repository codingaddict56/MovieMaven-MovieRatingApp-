import React, { useEffect, useState } from 'react'
import banner1 from '../images/banner/banner1.jpg'
import { useLocation } from 'react-router-dom'
import { Modal,Rate, message } from 'antd'
import ErrorComponent from '../components/ErrorComponent'
import axios from 'axios'
import moment from 'moment/moment'


function MovieDetail() {

  const {state} = useLocation()
  
  const [modal,setmodal] = useState(false)
  const [data,setdata] = useState({ratings:'',title:'',summary:''})  
  const [error,seterror] = useState({ratings:'',title:'',summary:''})  

  const [review,setreviews] = useState([])

  function handlechange(e){
    setdata({...data,[e.target.name]:e.target.value})
    seterror({...error,[e.target.name]:''})
  }

  console.log("data",data)


  useEffect(()=>{
    getreviews()
  },[])


  async function getreviews(){
    const response =  await axios.get(`${process.env.REACT_APP_BACKEND_URL}movie_review/get`)
    // console.log("response?.data",response?.data)

    setreviews(response?.data?.datas)

  }


  async function submitForm(){
    const header = {headers:{
      'Content-Type': 'application/json',
    }}   
    const response =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}movie_review/create`,data,header)
    if(response.status === 201){
        message.success("Movie Review Added Successfully!",1.5)
        resetform()
        setmodal(false)
    }

  }

  function resetform(){
    setdata({ratings:'',title:'',summary:''})
    seterror({ratings:'',title:'',summary:''})
    setmodal(false)
  }

  
  return (
    <div className='bg-black py-10'>


           
      <Modal open={modal} closable={false} footer={false}>         
        <div>
    
            <h6 className='font-[800] text-[17px]'>Add Review for the movie...</h6>

            <h6 className='text-[13px] mt-2 font-[400] mb-[5px]'>Rating</h6>
            <Rate onChange={(v)=>setdata({...data,ratings:v})} count={10}/>

            <h6 className='text-[13px] mt-2 font-[400] mb-[5px]'>Title</h6>
            <input type="text" name='title' value={data?.title} onChange={handlechange} className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1' placeholder='' />
            <ErrorComponent error={error?.title} />
            <h6 className='text-[13px] font-[400] mb-[5px]'>Summary</h6>
            <textarea type="text" name='summary' value={data?.summary} onChange={handlechange} className='border w-[100%] mb-4 focus:outline-none rounded placeholder:text-[13px] pl-2 py-1' placeholder='' />
            <ErrorComponent error={error?.summary} />

            <button onClick={()=>setmodal(false)} className='bg-gray-200 font-[500] text-black rounded text-[11px] py-[4px]  px-2'>Close </button>    
            <button onClick={submitForm} className='bg-[#0ba9d9] font-[500] text-black ml-2 rounded text-[11px] py-[4px]  px-2'>Add Review</button>    
        </div> 
        </Modal> 
        
        
        <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${state?.image}`} className='w-screen object-contain h-[500px]' />


        <div className='text-white py-4 px-4'>
            <h6 className='font-bold text-[24px]'>{state?.title}</h6>
            <h6>{state.description}</h6>
            <div className='min-w-[20%] border-l border-t border-r border-gray-700 mt-2 max-w-max'>
            <h6 className='flex items-center text-[13px] p-1 border-b border-gray-700'>Genre : <h6 className='ml-2 text-[#0ba9d9] font-[800]'>{state?.genre}</h6></h6>
            <h6 className='flex items-center text-[13px] p-1 border-b border-gray-700'>Director : <h6 className='ml-2 text-[#0ba9d9] font-[800]'>{state?.director}</h6></h6>
            <h6 className='flex items-center text-[13px] p-1 border-b border-gray-700'>Cast : <h6 className='ml-2 text-[#0ba9d9] font-[800]'>{state.cast}</h6></h6>
            <h6 className='flex items-center text-[13px] p-1 border-b border-gray-700'>Synopsis : <h6 className='ml-2 text-[#0ba9d9] font-[800]'>{state?.synopsis}</h6></h6>
            <h6 className='flex items-center text-[13px] p-1 border-b border-gray-700'>Duration : <h6 className='ml-2 text-[#0ba9d9] font-[800]'>{state?.duration}</h6></h6>
            </div>
        </div>


        <div className='text-white'>
            <h6 className='ml-5 border-b border-gray-600  pb-2'>Movie <span className='text-[#0ba9d9] font-[800]'>Actors</span></h6>
        </div>

        <div className='text-white'>
            <h6 className='ml-5 border-b border-gray-600  pb-2'>Movie <span className='text-[#0ba9d9] font-[800]'>Reviews</span></h6>


            <div className='border border-gray-700 rounded mx-4 mt-5 p-4 w-[50%]'>
              <div className='flex items-center justify-between'>
              <h6 className='text-[12px]'>Total Reviews ({review?.length}) </h6>
              <button onClick={()=>setmodal(true)} className='bg-[#0ba9d9]  p-1 ml-2 font-[800] text-[10px] rounded'>Add Review</button>
              </div>
              {review?.map((r)=>(
                <div className='border-t border-gray-600 p-1 mt-2'>
                   <h6 className='capitalize font-[700]'>{r?.title}</h6>
                   <h6 className='text-[14px] text-gray-400'>{r?.summary}</h6>
                   <h6 className='text-[12px]'>Review Added At : {moment(r?.createdAt)?.format('LLL')}</h6>
                </div>  
              ))}

            </div>
        </div>
    </div>
  )
}

export default MovieDetail