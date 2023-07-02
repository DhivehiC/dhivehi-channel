import React, { FC, Fragment, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
    children?: ReactNode,
    className?: string
}

const Container:FC<Props> = (props) => {
    return (
        <div className={twMerge([
            'container mx-auto px-4',
            props.className && props.className
        ])}>
            {props.children}
        </div>
    )
}

export default Container