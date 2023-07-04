import React, { FC, Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

const AdCard:FC<Props> = (props) => {
    return (
        <div className={twMerge(['sticky top-[100px]', props?.className])}>
            <div className='bg-accent w-full aspect-[8/10] lg:max-w-xs mr-auto overflow-hidden rounded-lg'>

            </div>
            <h6 className='text-dark-accent text-left'>ad</h6>
        </div>
    )
}

export default AdCard

interface Props {
    className?: string
}