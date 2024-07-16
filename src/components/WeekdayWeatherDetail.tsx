import React from 'react'
import Container from './Container'
import WeatherIcons from './WeatherIcons'
import WeatherDetails from './WeatherDetails'
import { WeatherDetailsProps } from './WeatherDetails'
import { KtoC } from  "@/utils/helpers";

export interface WeekdayWeatherDetailsProps extends WeatherDetailsProps {
    weatherIcon: string,
    date: string,
    day: string,
    temp: number,
    temp_min: number,
    temp_max: number,
    description: string
}

export default function weekdayweatherdetail(props: WeekdayWeatherDetailsProps) {
    const {
        weatherIcon =  '',
        date = '',
        day = '',
        temp = 0,
        temp_min = 0,
        temp_max = 0,
        description = ''
    } = props;

    return (
        <Container className='gap-4'>

            <section className='flex gap-4 items-center px-4'>

                {/* Weekday weather icon and day */}
                <div className='flex flex-col gap-1 items-center'>

                    <WeatherIcons iconName={weatherIcon} />
                    <p>{date}</p>
                    <p className='text-sm'>{day}</p>

                </div>


                {/* Weekday temperature and conditions */}
                <div className='flex flex-col px-4'>

                    <span className='text-5xl'>{KtoC(temp ?? 0)}°</span>
                    {/* min max temp goes here */}
                    <p className='capitalize'>{description}</p>

                </div>
            
            </section>

            {/* Weekday weather params */}
            <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
                <WeatherDetails {...props} />
            </section>

        </Container>
    )
}