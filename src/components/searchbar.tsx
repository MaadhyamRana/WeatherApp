import { cn } from '@/utils/cn';
import React from 'react'

// react-icon imports
import { IoSearch } from 'react-icons/io5'

type Props = {
    className?: string;
    value: string;
    onChange:React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit:React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function searchbar(props: Props) {
  return (
    <form
        onSubmit={props.onSubmit}
        className={cn(
            'flex relative items-center justify-center h-10',
            props.className
        )}
    >
    
    <input 
        type='text'
        value={props.value}
        onChange={props.onChange}
        placeholder='Example: New York City'
        className='px-4 py-2 w-[230px] h-full
                   border border-gray-300 rounded-l-md 
                   focus:outline-none focus:border-blue-500' 
    />

    <button
        className='px-3 py-[9px] h-full
                   bg-blue-500 text-white
                   rounded-r-md
                   focus:outline-none hover:bg-blue-600
                   whitespace-nowrap'
    >
        <IoSearch />
    </button>
    
    </form>
  )
}