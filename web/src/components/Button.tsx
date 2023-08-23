import React, { FC, MouseEventHandler, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const Button:FC<Props> = (props) => {
    return (
        <button {...props} disabled={props.loading} onClick={props?.onClick} className={twMerge('bg-primary text-white py-3 px-6 rounded-lg hover:opacity-75 active:opacity-50', props?.className)}>
            {
                props.loading ?
                props.children :
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            }
        </button>
    )
}

export default Button

interface Props {
    onClick?: MouseEventHandler,
    className?: string,
    loading: boolean,
    children: ReactNode,
    [name:string]: unknown
}