import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
    className?: string
    data: {
        createdBy: String
        content?: String
        notApproved?: Boolean
    }
}

const ColumnCard:FC<Props> = (props) => {
    const className = twMerge([
        "mb-3 p-4 bg-[#f2f2f2] breaking:bg-dangerlight",
        props?.className
    ])

    return (
        <div className={className}>
            <h6 className="text-primary mb-2 font-bold text-xl">
                {props.data.createdBy}
                {
                    props.data?.notApproved && <span className=' text-white bg-yellow-500 px-3 text-[14px] mx-2'>އަދި އެޕްރޫވް ނުވޭ</span>
                }
            </h6>
            <p className='text-gray-700'>{props.data?.content}</p>
        </div>
    )
}

export default ColumnCard