import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const Button:FC<Props> = (props) => {
    return (
        <button {...props} onClick={props?.onClick} className={twMerge('bg-primary text-white py-3 px-6 rounded-lg hover:opacity-75 active:opacity-50', props?.className)}>
            
        </button>
    )
}

export default Button

interface Props {
    onClick?: () => void,
    className?: string,
    [name:string]: unknown
}