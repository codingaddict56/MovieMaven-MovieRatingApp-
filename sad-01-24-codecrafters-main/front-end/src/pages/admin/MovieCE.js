import React, { useEffect, useState } from 'react'
import DashboardMenu from './DashboardMenu'
import ErrorComponent from '../../components/ErrorComponent'
import axios from 'axios'
import { message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {FiUpload} from 'react-icons/fi'
import {IoClose} from 'react-icons/io5'

function MovieCE() {

  const navigator = useNavigate()
  const {state} = useLocation()
  

  const [data,setdata] = useState({movieId:'',title:'',image:'',genre:'',releaseDate:'',director:'',cast:'',synopsis:'',duration:'',description:'',rating:'',video:''})  
  const [error,seterror] = useState({movieId:'',title:'',image:'',genre:'',releaseDate:'',director:'',cast:'',synopsis:'',duration:'',description:'',rating:'',video:''})  
  
  
  useEffect(()=>{
      if(state?._id !== undefined){
        setdata({...state})
      }
  },[state])

  function handlechange(e){
    setdata({...data,[e.target.name]:e.target.value})
    seterror({...error,[e.target.name]:''})
  }

  async function uploadFile(v,name){
    const fd = new FormData()
    fd.append('file',v)

   const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}movie/upload_file`,fd)
   console.log("response",response?.data)
   setdata({...data,[name]:response?.data?.data})

  }


  async function submitForm(){
    const header = {headers:{
        'Content-Type': 'application/json',
    }}    
    
    const response =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}movie/create`,data,header)
    if(response.status === 201){
        message.success("Movie Created Successfully!",1.5)
        resetform()
    }
  }

  function resetform(){
    setdata({movieId:'',title:'',image:'',genre:'',releaseDate:'',director:'',cast:'',synopsis:'',duration:'',description:'',rating:'',video:''})
    seterror({movieId:'',title:'',image:'',genre:'',releaseDate:'',director:'',cast:'',synopsis:'',duration:'',description:'',rating:'',video:''})
  }

  async function goBack(){
    navigator(-1)
  }

  return (
    <div className='flex'>

      

        
        <div className='min-w-44 max-w-44'>
        <DashboardMenu />
        </div>


        <div  className='p-4 w-[100%]'>

            <div >
                <h6>Add / Edit Movie for <span className='font-[700]'>MovieMaven</span></h6>
                

                <div className='flex  w-[40%]'>

                    <div className='w-[48%]'>
                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Movie Id</h6>
                        <input type='text' name={'movieId'} value={data?.movieId} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.movieId} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Title</h6>
                        <input type='text' name={'title'} value={data?.title} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.title} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Genre</h6>
                        <input type='text' name={'genre'} value={data?.genre} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.genre} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Release Date</h6>
                        <input type='date' name={'releaseDate'} value={data?.releaseDate} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.releaseDate} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Director</h6>
                        <input type='text' name={'director'} value={data?.director} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.director} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Image</h6>
                         
                        {data.image === '' ?
                        <form onClick={()=>document.querySelector('.input-field').click()} className={`p-4 flex flex-col items-center justify-center cursor-pointer border-dashed border border-slate-400 `}>
                            <FiUpload size={24} />
                            <span className='font-bold text-[10px] mt-1 text-center'>Click To Upload Photo</span>
                            <span className='font-bold text-[7px] mt-0 text-center'>Supported Type JPEG,PNG,SVG,WEBP,PDF,XLSX,PPT</span>
                            <input type='file' onChange={({target:{files}})=>{
                            files[0] && uploadFile(files[0],'image')
                            }} accept="*" className='input-field' hidden />
                        </form> 
                        :
                        <div className='p-2 border relative flex flex-col  cursor-pointer'>
                            <IoClose className='absolute top-3 right-2' onClick={()=>setdata({...data,image:''})}/>
                            <h6 className='text-[12px] truncate w-48 ml-0'>{data?.image !== undefined ? data?.image : data?.image}</h6>
                        </div>}

                        {/* <input type='file' onChange={(e)=>{uploadFile(e.target.files[0],'image')}}  className='mt-2' /> */}
                        
                    </div>
                    

                    <div className='ml-5 w-[48%]'>

                    <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Cast</h6>
                        <input type='text' name={'cast'} value={data?.cast} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.cast} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Synopsis</h6>
                        <input type='text' name={'synopsis'} value={data?.synopsis} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.synopsis} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Duration</h6>
                        <input type='text' name={'duration'} value={data?.duration} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.duration} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Description</h6>
                        <input type='text' name={'description'} value={data?.description} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.description} />

                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Ratings</h6>
                        <input type='number' name={'rating'} value={data?.rating} onChange={handlechange} className='border border-gray-300 focus:outline-none w-[100%] p-1 px-2' />
                        <ErrorComponent error={error?.rating} />

                       
                        <h6 className='text-[12px] mt-2 mb-1 font-[600]'>Video</h6>
                        {/* <input type='file' onChange={(e)=>{uploadFile(e.target.files[0],'video')}} className='mt-2' /> */}
                        {data.video === '' ?
                        <form onClick={()=>document.querySelector('.input-field1').click()} className={`p-4 flex flex-col items-center justify-center cursor-pointer border-dashed border border-slate-400 `}>
                            <FiUpload size={24} />
                            <span className='font-bold text-[10px] mt-1 text-center'>Click To Upload Photo</span>
                            <span className='font-bold text-[7px] mt-0 text-center'>Supported Type JPEG,PNG,SVG,WEBP,PDF,XLSX,PPT</span>
                            <input type='file' onChange={({target:{files}})=>{
                            files[0] && uploadFile(files[0],'video')
                            }} accept="*" className='input-field1' hidden />
                        </form> 
                        :
                        <div className='p-2 border relative flex flex-col  cursor-pointer'>
                            <IoClose className='absolute top-3 right-2' onClick={()=>setdata({...data,video:''})}/>
                            <h6 className='text-[12px] truncate w-48 ml-0'>{data?.video !== undefined ? data?.video : data?.video}</h6>
                        </div>}

                    </div>

                </div>

                <div className='mt-4 -ml-2'>
                    <button className='bg-slate-200 p-1 px-3 ml-2 font-[800] text-[13px] rounded' onClick={goBack}>Cancel</button>
                    <button className='bg-[#0ba9d9] p-1 px-3 ml-2 font-[800] text-[13px] rounded' onClick={submitForm}>Submit</button>
                </div>
            </div>

       
        </div>
    </div>
  )
}

export default MovieCE