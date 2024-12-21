import React, { useEffect, useState } from 'react'
import DashboardMenu from './DashboardMenu'
import { Modal, message,Pagination } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function MovieList() {

  const navigator = useNavigate()
  const [datas,setdatas] = useState([]) 
  const [pagination,setpagination] = useState({}) 
  const [selectedData,setselectedData] = useState({}) 
  const [text,settext] = useState('') 
  const [modal,setmodal] = useState(false) 
  const [filterApplied,setfilterApplied] = useState(false) 
  const [page,setpage] = useState(1) 

  useEffect(()=>{
    if(filterApplied){
      searchmovie()
    }else{
      getmovie()
    }
  },[page,filterApplied])

  async function searchmovie(){
    const response =  await axios.get(`${process.env.REACT_APP_BACKEND_URL}movie/search?text=${text}&page=${page}`)
    setdatas(response?.data?.datas)
    setpagination(response?.data?.pagination)
  }

  async function getmovie(){
    const response =  await axios.get(`${process.env.REACT_APP_BACKEND_URL}movie/get?page=${page}`)
    setdatas(response?.data?.datas)
    setpagination(response?.data?.pagination)
  }

  async function deletedata(){
    const response =  await axios.delete(`${process.env.REACT_APP_BACKEND_URL}movie/delete/${selectedData?._id}`)
    if(response.status === 200){
      message.info("Deleted Successfully",1.5)
      setmodal(false)
      setselectedData({})
      setpage(1)
    }
  }

  return (
    <div className='flex'>
      <Modal open={modal} width={300} closable={false} footer={false}>
        <div> 
           <h6 className='font-[700]'>Delete Data</h6>
           <h6 className='text-[11px]'>Are you sure want to delete the selected data once deleted will not be retrieved!.</h6>

           <h6 className='text-[13px]'>Title : <span className='font-[800]'>{selectedData?.title}</span></h6>
           <h6 className='text-[13px] mb-4'>Description : <span className='font-[800]'>{selectedData?.description}</span></h6>
         

           <button onClick={()=>setmodal(false)} className='bg-gray-200 font-[500] text-black rounded text-[11px] py-[4px]  px-2'>Cancel</button>  
            <button onClick={()=>deletedata()} className='bg-red-400 font-[500] text-black ml-2 rounded text-[11px] py-[4px]  px-2'>Confirm</button> 

        </div>

      </Modal>

      

        
        <div className='min-w-44 max-w-44'>
        <DashboardMenu />
        </div>

        <div className='p-4 w-[100%]'>
            <div className='flex border-b border-gray-300 pb-2 items-center justify-between'>
                <h6 className='font-[800]'>Movie List ({pagination?.total}) </h6>
                <div>
                    <input value={text} onChange={(e)=>settext(e.target.value)} type="text" placeholder='search' className='p-1 pl-2 border border-gray-200 placeholder:text-[13px] rounded focus:outline-none text-[13px] ' />
                    <button onClick={()=>setfilterApplied(true)} className='bg-[#0ba9d9] p-1 px-3 ml-2 font-[800] text-[13px] rounded'>Apply Filter</button>
                    <button onClick={()=>{setfilterApplied(false);settext('')}} className='bg-[#000] p-1 px-3 ml-2 font-[800] text-white text-[13px] rounded'>Reset Filter</button>
                    <button onClick={()=>navigator('create')} className='bg-[#0ba9d9] p-1 px-3 ml-2 font-[800] text-[13px] rounded'>Add Movie</button>
                </div>
            </div>


            <table className='mt-2'>
              <thead >
                <tr className='text-[13px] font-[400] border bg-gray-100'>
                  <th className='w-[5%] p-1 text-left border-r border-gray-300'>Sl No</th>
                  <th className='w-[15%] p-1 text-left border-r border-gray-300'>Movie Id</th>
                  <th className='w-[20%] p-1 text-left border-r border-gray-300'>Title </th>
                  <th className='w-[15%] p-1 text-left border-r border-gray-300'>Director </th>
                  <th className='w-[5%] p-1 text-left border-r border-gray-300'>Poster </th>
                  <th className='w-[10%] p-1 text-left border-r border-gray-300'>Duration </th>
                  <th className='w-[20%] p-1 text-left border-r border-gray-300'>Description </th>
                  <th className='w-[15%] p-1 text-left border-r '>Action </th>
                </tr>
              </thead>

              <tbody>
                {datas?.map((d,i)=>(
                <tr className='text-[13px] font-[400] border'>
                  <td className='truncate w-[5%] p-1 border-r border-gray-300'>{i+1}</td>
                  <td className='truncate w-[15%] p-1 border-r border-gray-300'>{d?.movieId}</td>
                  <td className='truncate w-[20%] p-1 border-r border-gray-300'>{d?.title} </td>
                  <td className='truncate w-[15%] p-1 border-r border-gray-300'>{d?.director} </td>
                  <td className='truncate w-[5%] p-1 border-r border-gray-300'>{<img className='w-[60%] h-[20px] object-contain' src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${d?.image}`}/>} </td>
                  <td className='truncate w-[10%] p-1 border-r border-gray-300'>{d?.duration} </td>
                  <td className='truncate w-[20%] p-1 border-r border-gray-300'>{d?.description} </td>
                  <td className='truncate w-[15%] p-1 border-r '>
                    <button onClick={()=>navigator('edit',{state:d})} className='bg-blue-400 font-[500] text-black rounded text-[11px] py-[1px]  px-2'>Edit</button>  
                    <button onClick={()=>{setselectedData(d);setmodal(true)}} className='bg-red-400 font-[500] text-black ml-2 rounded text-[11px] py-[1px]  px-2'>Delete</button>  
                  </td>
                </tr>))}
              </tbody>

            </table>  

            
            <div className='flex items-center justify-center my-10'>
            <Pagination total={pagination?.total} size='small' onChange={(v)=>setpage(v)} pageSize={pagination?.limit} />
            </div>
        </div>

    </div>
  )
}

export default MovieList