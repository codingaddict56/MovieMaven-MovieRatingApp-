import React, { useEffect, useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import banner1 from '../images/banner/banner1.jpg'
import banner2 from '../images/banner/banner2.jpg'
import banner3 from '../images/banner/banner3.jpg'
import banner4 from '../images/banner/banner4.jpg'

import { IoIosArrowBack,IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdStar } from "react-icons/io";
import { FaPlay } from "react-icons/fa";

function Home() {

    const navigator = useNavigate()

    const [datas,setdatas] = useState([])

    const bannerArr = [banner1,banner2,banner3,banner4]
    
    useEffect(()=>{
      getmovie()
    },[])

    async function getmovie(){
      const response =  await axios.get(`${process.env.REACT_APP_BACKEND_URL}movie/get_all`)
      setdatas(response?.data?.datas)
    }
  
  return (
    <div className='bg-black'>

<div className='relative'>
            <Carousel 
              centerMode={true} 
              autoPlay={true} 
              infiniteLoop={true}
              showStatus={false}
              showThumbs={false}
              showArrows={true}
              swipeable={true}
              autoFocus={true}
              interval={5000}
              centerSlidePercentage={100}
              showIndicators={false}
              className='relative -z-0'
            
            //   onChange={(e)=>{
            //     setindex(e)
            //   }}
              
              renderArrowPrev={(clickHandler, hasPrev) => {
                return (
                  <div
                    className={`${hasPrev ? "opacity-100" : "opacity-100"} absolute backdrop-filter  bg-white/60 backdrop-blur-sm left-[20px] rounded bottom-[40%] md:bottom-[40%] z-100   flex justify-center items-center p-2  cursor-pointer z-20`}
                    onClick={clickHandler}
                  >
                    <IoIosArrowBack size={14} className="text-black" />
                  </div>
                );
              }}
              renderArrowNext={(clickHandler, hasPrev) => {
                return (
                  <div
                    className={`${hasPrev ? "opacity-100" : "opacity-100"} absolute backdrop-filter  bg-white/60 backdrop-blur-sm  right-[20px] rounded md:right-4 bottom-[40%] md:bottom-[40%]   flex justify-center items-center p-2  cursor-pointer z-20`}
                    onClick={clickHandler}
                  >
                    <IoIosArrowForward size={14} className="text-black" />
                  </div>
                );
              }}
            
            >
                {bannerArr?.map((c,i)=>(
                    <div className='text-center relative flex justify-end w-[90%] my-10  md:h-[80vh]  overflow-hidden z-1  mx-auto focus:outline-none focus:ring-0'>
                        <img src={c}  className='w-full  relative h-[32vh] md:h-[91vh] object-cover md:object-cover focus:outline-none focus:ring-0 '/>

                      
                    </div>    
                ))}




              
            </Carousel>
            
      </div>


        <div className='py-10'>
            <h6 className='text-[#0ba9d9] text-[11px] font-[800] text-center'>OUR LATES MOVIES</h6>
            <h6 className='text-[#fff] font-bold text-[25px]  text-center'>RECENT MOVIES JUST FOR YOU</h6>
            <h6 className='text-[#FFF] text-[15px] opacity-70 w-[50%] my-2 mx-auto text-center'>Watch full seasons of exclusive streaming series, current-season episodes, hit movies, Hulu Originals, kids shows, and more.</h6>
        </div>

        <div className='grid gap-4 w-[80%] pb-10 mx-auto grid-cols-6'>
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
    </div>
  )
}

export default Home