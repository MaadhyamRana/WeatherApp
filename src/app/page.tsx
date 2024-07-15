'use client'

import Container from "@/components/container";
import Navbar from "@/components/navbar";
import WeatherDetails from "@/components/weatherdetails";
import Weathericons from "@/components/weathericons";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Image from "next/image";
import { useQuery } from "react-query";

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

  // API Call
  const { isFetching, error, data } = useQuery<WeatherData>({
      queryKey: ['repoData'],
      queryFn: async() =>  {
          const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=9`
          );
          return data;
      }
  });

  // Loading wait
  if (isFetching) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
  )};
  
  // Data test
  // console.log("data", data);
  
  const firstData = data?.list[0];
  
  // Helpers
  function KtoC(K: number): number {
    return Math.floor(K - 273.15); 
  }

  function MtoKM(M: number): string {
    return `${(M / 1000).toFixed(0)}`;
  }

  function MStoKMH(M: number): string {
    return `${(M * 3.6).toFixed(0)}`;
  }

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
                    
                    <Weathericons iconName={d.weather[0].icon} />

                    <p>{KtoC(d?.main.temp ?? 0)}°</p>
                  
                  </div>
                
                ))}

              </div>

            </Container>
          </div>

          <div className=" flex gap-4">
            
            {/* Current conditions */}
            <Container className="w-fit justify-center flex-col px-4 items-center">

                <p className="capitalize text-center">{firstData?.weather[0].description}</p>
                <Weathericons iconName={firstData?.weather[0].icon ?? ""} />

            </Container>

            {/* Other weather details */}
            <Container className="px-6 gap-4 justify-between overflow-x-auto">

            <WeatherDetails 
              visibility={`${MtoKM(firstData?.visibility ?? 0)} km`}
              humidity={`${firstData?.main.humidity} %`}
              airPressure={`${firstData?.main.pressure} hPa`}
              windSpeed={`${MStoKMH(firstData?.wind.speed ?? 0)} km/h`}
              sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), "H:mm aaa")}
              sunset={format(fromUnixTime(data?.city.sunset ?? 0), "H:mm aaa")}
            ></WeatherDetails>

            </Container>
          
          </div>
        </section>

        {/* Week */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">This week&#39;s forecast</p>
        </section>

      </main>
    </div>
  );
}
