'use client'

import Container from "@/components/Container";
import Navbar from "@/components/NavBar";
import WeatherDetails from "@/components/WeatherDetails";
import Weathericons from "@/components/WeatherIcons";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Image from "next/image";
import { useQuery } from "react-query";
import { KtoC, MtoKM, MStoKMH } from  "@/utils/helpers";
import WeekdayWeatherDetails from "@/components/WeekdayWeatherDetail";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

// Weather data types
interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[]

  city: {
    id: number;
    name: string;

    coord: {
      lat: number;
      lon: number;
    };

    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  }
}

interface WeatherEntry {
  dt: number;

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level?: number;
    grnd_level?: number;
    humidity: number;
    temp_kf?: number;
  };

  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];

  clouds: {
    all: number;
  };

  wind: {
    speed: number;
    deg: number;
    gust: number;
  };

  visibility: number;

  pop: number;

  rain?: {
    '3h': number;
  };

  sys: {
    pod: string;
  };

  dt_txt: string;
}

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  // API Call
  const { isFetching, error, data, refetch } = useQuery<WeatherData>({
      queryKey: ['repoData'],
      queryFn: async() =>  {
          const { data } = await axios.get(
            // (168 hours in a week) / (3 hour time difference b/w each data point) = 56 weather data points
            `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
          );
          return data;
      }
  });

  useEffect(() => {refetch();}, [place, refetch]);

  // Loading wait
  if (isFetching) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
  )};

  // The first WeatherEntry, corresponding to current time
  const firstDataToday = data?.list[0];
  
  const weekdays = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ]

  const firstDataWeekdays = weekdays.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 0;
    })
  })

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">

        {loadingCity ? <WeatherSkeleton/ > : 

          <>

          {/* Today */}
          <section className="space-y-4">

            {/* Today's weather timeline */}
            <div className="space-y-2">

              <h2 className="flex gap-1 text-2xl item-end">
                <p>{format(parseISO(firstDataToday?.dt_txt ?? ""), 'EEEE')}</p>
                <p className="text-lg mt-1">({format(parseISO(firstDataToday?.dt_txt ?? ""), 'dd.MM.yyyy')})</p>
              </h2>

              <Container className="gap-10 px-6 items-center">
                
                {/* Temperature */}
                <div className="flex flex-col px-4">
                  
                  {/* Current Temperature */}
                  <span className="text-5xl">
                  {KtoC(firstDataToday?.main.temp ?? 0)}°
                  </span>
                  
                  {/* Feels Like */}
                  <p className="text-xs space-x-1 whitespace-nowrap">
                    <span> Feels like</span>
                    <span>{KtoC(firstDataToday?.main.feels_like ?? 0)}°</span>
                  </p>

                  {/* Day Min/Max Temperature */}
                  <p className="text-xs space-x-2">
                    <span>
                    {KtoC(firstDataToday?.main.temp_min ?? 0)}°↓{" "}
                    </span>
                    <span>
                    {" "}{KtoC(firstDataToday?.main.temp_max ?? 0)}°↑
                    </span>
                  </p>

                </div>

                {/* 24Hr timeline */}
                <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                  
                  {data?.list.map((d,i) => (
                    
                    <div 
                      key={i}
                      className="flex flex-col justify-between gap-2 items-center text-xs font-semibold pb-5"
                    >

                      <p className="whitespace-nowrap">
                        {format(parseISO(d.dt_txt), "h:mm a")}
                      </p>
                      
                      <Weathericons iconName={d.weather[0].icon ?? "01d"} />

                      <p>{KtoC(d?.main.temp ?? 0)}°</p>
                    
                    </div>
                  
                  ))}

                </div>

              </Container>

            </div>

            {/* Other weather details for the day */}
            <div className=" flex gap-4">
              
              <Container className="w-fit justify-center flex-col px-4 items-center">

                  <p className="capitalize text-center">{firstDataToday?.weather[0].description}</p>
                  <Weathericons iconName={firstDataToday?.weather[0].icon ?? "01d"} />

              </Container>

              <Container className="px-6 gap-4 justify-between overflow-x-auto">

              <WeatherDetails 
                visibility={`${MtoKM(firstDataToday?.visibility ?? 0)} km`}
                humidity={`${firstDataToday?.main.humidity} %`}
                airPressure={`${firstDataToday?.main.pressure} hPa`}
                windSpeed={`${MStoKMH(firstDataToday?.wind.speed ?? 0)} km/h`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), "H:mm aaa")}
                sunset={format(fromUnixTime(data?.city.sunset ?? 0), "H:mm aaa")}
              ></WeatherDetails>

              </Container>
            
            </div>

          </section>

          {/* Week */}
          <section className="flex w-full flex-col gap-4">
            <p className="text-2xl">This week&#39;s forecast</p>
            {firstDataWeekdays.map((d,i) => (

              <WeekdayWeatherDetails 
              
                  key={i}
                
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                  day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                  temp={d?.main.temp ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  description={d?.weather[0].description ?? ""}
                  visibility={`${MtoKM(d?.visibility ?? 0)} km`}
                  humidity={`${d?.main.humidity ?? 0} %`}
                  windSpeed={`${MStoKMH(d?.wind.speed ?? 0)} km/h`}
                  airPressure={`${d?.main.pressure ?? 0} hPa`}
                  sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), "H:mm")}
                  sunset={format(fromUnixTime(data?.city.sunset ?? 0), "H:mm")}
                
                />
            
            ))}
          </section>

          </>

        }

      </main>
    </div>
  );
}


function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
