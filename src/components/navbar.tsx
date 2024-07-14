import React from 'react'
import SearchBar from '@/components/searchbar'

// react-icon imports
import { FaCloudSunRain } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";

type Props = {}

export default function navbar({}: Props) {
  return (
    <nav className="sticky shadow-sm top-0 left-0 z-50 bg-white">
        <div className='h-[80px] flex justify-between items-center w-full max-w-7xl px-3 mx-auto'> 
            <p className='flex items-center justify-center gap-2'>
                <FaCloudSunRain className='text-4xl mt-1 text-yellow-300'/>
                <span className='text-gray-500 text-3xl'> ~ WeatherApp</span>
            </p>

            {/* */}

            <section className='flex gap-2 items-center'>
                <MdMyLocation className='text-2xl hover:opacity-50 cursor-pointer' title='Use My Location'/>    
                <MdOutlineLocationOn className='text-2xl'/>
                <div><SearchBar /></div>
            </section>
        </div>
    </nav>
  )
}