import React, { FC, Fragment, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from './Heading'

interface Props {
    title?: string
    type?: 'success' | 'failed'
    content?: string
    active?: boolean
}

const Notification:FC<Props> = (props) => {
    return (
        <div className={twMerge([
            'transition-all bg-secondary shadow-lg rounded-md border z-50 border-gray-900 p-4 fixed right-4 bottom-4 w-[calc(100vw-16px-16px)] max-w-sm',
            !props.active && 'bottom-0 opacity-0 invisible'
        ])}>
            <Heading level={24} className={twMerge([
                'mb-1 text-accent',
                props.type === "success" && "text-success",
                props.type === "failed" && "text-danger",
            ])}>
                {props.title}
            </Heading>
            <Heading level={16} className="text-accent">{props.content}</Heading>
        </div>
    )
}

export default Notification