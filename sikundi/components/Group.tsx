import React, { FC, Fragment, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
    className?: string,
    children?: ReactNode
}

const Group:FC<Props> = (props) => {
    const styles = twMerge([
        'p-4 bg-secondary rounded-lg',
        props.className && props.className
    ])
    return (
        <div className={styles}>
            {props.children}
        </div>
    )
}

export default Group