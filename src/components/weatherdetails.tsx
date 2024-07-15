import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import {LuEye, LuSunrise, LuSunset} from 'react-icons/lu'
import { MdAir } from 'react-icons/md';

type Props = {}

export interface WeatherParamProps {
    information: string;
    icon: React.ReactNode;
    value: string;
}

function WeatherParam(props: WeatherParamProps) {
    return (
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            
            <p className='whitespace-nowrap'>{props.information}</p>
            <div className='text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        
        </div>
    );
}

export interface WeatherDetailsProps {
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function weatherdetails(props: WeatherDetailsProps) {
    const {
        visibility = '- km',
        humidity = ' - %',
        windSpeed = ' - km/h',
        airPressure = '- hPa',
        sunrise = '-',
        sunset = '-'
    } = props;

    return (
        <>

        <WeatherParam
            information='Visibility'
            icon={<LuEye />}
            value={props.visibility}
        ></WeatherParam>

        <WeatherParam
            information='Humidity'
            icon={<FiDroplet />}
            value={props.humidity}
        ></WeatherParam>

        <WeatherParam
            information='Wind Speed'
            icon={<MdAir />}
            value={props.windSpeed}
        ></WeatherParam>

        <WeatherParam
            information='Air Pressure'
            icon={<ImMeter />}
            value={props.airPressure}
        ></WeatherParam>

        <WeatherParam
            information='Sunrise'
            icon={<LuSunrise />}
            value={props.sunrise}
        ></WeatherParam>

        <WeatherParam
            information='Sunset'
            icon={<LuSunset />}
            value={props.sunset}
        ></WeatherParam>

        </>
    )
}
