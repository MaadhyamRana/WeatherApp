'use client'

import React, { useState } from 'react'
import SearchBar from '@/components/SearchBar'

// react-icon imports
import { FaCloudSunRain } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import axios from 'axios';
import { da } from 'date-fns/locale';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '@/app/atom';

type Props = { location? : string };

export default function Navbar({location}: Props) {

  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [_, setPlace] = useAtom(placeAtom);
  const [__, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);

    if (value.length >= 3) {
      
      try {

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
        );

        const suggestions = response.data.list.map((item:any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);

      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }

    }

    else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch (e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();

    if (suggestions.length == 0) {
      setError("Location not found");
      setLoadingCity(false);
    } else {
      
      setError('');

      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);

    }
  }

  function handleCurrentLocation () {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async(pos) => {
        const {latitude, longitude} = pos.coords;

        try {
          
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
          );
          setTimeout (() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500)

        } catch (error) {
          setLoadingCity(false);
        }

      })
    }
  }

  return (
    <>
      <nav className="sticky shadow-sm top-0 left-0 z-50 bg-white">
          <div className='h-[80px] flex justify-between items-center w-full max-w-7xl px-3 mx-auto'> 

              <p className='flex items-center justify-center gap-2'>
                  <FaCloudSunRain className='text-4xl mt-1 text-yellow-300'/>
                  <span className='text-gray-500 text-3xl'> ~ WeatherApp</span>
              </p>

              <section className='flex gap-2 items-center'>
                  
                  <MdMyLocation 
                    className='text-2xl hover:opacity-50 cursor-pointer' 
                    title='Use My Location'
                    onClick={handleCurrentLocation}
                  />

                  <MdOutlineLocationOn className='text-2xl'/>
                  <p className='text-slate-900/80 text-sm'>{location}</p>

                  <div className='relative hidden md:flex'>

                    <SearchBar 
                      value={city}
                      onSubmit={handleSubmitSearch}
                      onChange={(e) => handleInputChange(e.target.value)}
                    />

                    <SuggestionBox
                      {...{
                          showSuggestions,
                          suggestions,
                          handleSuggestionClick,
                          error
                      }}
                    />

                  </div>
              </section>
          </div>
      </nav>

      <section className='flex max-w-7xl px-3 md:hidden'>
        <div className='relative'>

          <SearchBar 
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />

          <SuggestionBox
            {...{
                showSuggestions,
                suggestions,
                handleSuggestionClick,
                error
            }}
          />

        </div>
      </section>

    </>
  )
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
} : {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className='mb-4 bg-white absolute border top-[44px] left-0 border-gray-300
                      rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2'>
          
          {error && suggestions.length<1 && (
            <li className='text-red-500 p-1'>{error}</li>
          )}

          {suggestions.map((d,i) => (
            <li 
              key={i}
              onClick={() => handleSuggestionClick(d)}
              className='cursor-pointer p-1 rounded hover:bg-gray-200'
            >{d}</li>
          ))}

        </ul>
      )}
    </>
  )
}