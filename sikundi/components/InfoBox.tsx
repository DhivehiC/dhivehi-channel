import React, { FC, Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from './Heading'
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon'
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon'

interface Props {
    className?: string
    title?: string
    value?: number
    increase?: number
    decrease?: number
    caption?: string
}

const InfoBox:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary p-5 rounded-lg',
        props.className && props.className
    ])
    return (
        <div className={styles}>
            {
                props.title !== (null || undefined) &&
                <Heading level={24} className="font-light text-accent mb-5">{props.title}</Heading>
            }
            {
                props.value !== (null || undefined) &&
                <Heading level={30} className="font-bold text-white mb-7">{props.value}</Heading>
            }
            {
                props.increase !== (null || undefined) &&
                <div className="text-success mb-3 flex items-center gap-3">
                    <ArrowUpIcon className='h-4 w-4' />
                    <Heading level={16}>{props.increase}%</Heading>
                </div>
            }
            {
                props.decrease !== (null || undefined) &&
                <div className="text-danger mb-3 flex items-center gap-3">
                    <ArrowDownIcon className='h-4 w-4' />
                    <Heading level={16}>{props.decrease}%</Heading>
                </div>
            }
            {
                props.caption !== (null || undefined) &&
                <Heading level={14} className="text-background">{props.caption}</Heading>
            }
        </div>
    )
}

export default InfoBox