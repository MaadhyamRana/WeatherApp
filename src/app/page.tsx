'use client'

import Container from "@/components/container";
import Navbar from "@/components/navbar";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { useQuery } from "react-query";

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

  const { isFetching, error, data } = useQuery<WeatherData>({
      queryKey: ['repoData'],
      queryFn: async() =>  {
          const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=2`
          );
          return data;
      }
  });

  if (isFetching) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
  )};
  
  // console.log("data", data);
  
  const firstData = data?.list[0];
  
  function KtoC(K: number): number { return Math.floor(K - 273.15); }

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today */}
        <section className="space-y-4">
          <div className="space-y-2">

            {/* Main Card Day and Date */}
            <h2 className="flex gap-1 text-2xl item-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), 'EEEE')}</p>
              <p className="text-lg mt-1">({format(parseISO(firstData?.dt_txt ?? ""), 'dd.MM.yyyy')})</p>
            </h2>

            <Container className="gap-10 px-6 items-center">
              
              {/* Temperature */}
              <div className="flex flex-col px-4">
                
                {/* Current Temperature */}
                <span className="text-5xl">
                {KtoC(firstData?.main.temp ?? 0)}°
                </span>
                
                {/* Feels Like */}
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span> Feels like</span>
                  <span>{KtoC(firstData?.main.feels_like ?? 0)}°</span>
                </p>

                {/* Day Min/Max Temperature */}
                <p className="text-xs space-x-2">
                  <span>
                  {KtoC(firstData?.main.temp_min ?? 0)}°↓{" "}
                  </span>
                  <span>
                  {" "}{KtoC(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>

              </div>

              {/* Time and Weather Icons */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                
                {data?.list.map((d,i) => 
                  <div key={i}></div>
                )}

              </div>
            </Container>
          </div>
        </section>

        {/* Week */}
        <section></section>
      </main>
    </div>
  );
}
