import Link from 'next/link'
import React, { FC, Fragment } from 'react'
import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon'
import ChevronDoubleRightIcon from '@heroicons/react/24/solid/ChevronDoubleRightIcon'
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon'
import ChevronDoubleLeftIcon from '@heroicons/react/24/solid/ChevronDoubleLeftIcon'

interface Props {
    url: string
    total: number
    current: number
    className?: string
}

const Paginate:FC<Props> = (props) => {
    return (
        <div className={props?.className}>
            <p className='text-accent mb-2'>Total Pages: {props.total}</p>
            <ul className='flex gap-2 mb-2 flex-wrap'>
                {Number(props.current)-1 > 0 && <Link href={`${props.url}1`}>
                    <li className="bg-secondary text-accent rounded-md hover:opacity-75 active:opacity-50 h-full p-2 flex items-center justify-center">
                        <ChevronDoubleLeftIcon className='h-5 w-5' />
                    </li>
                </Link>}
                {Number(props.current)-1 > 0 && <Link href={`${props.url}${Number(props.current)-1}`}>
                    <li className="bg-secondary text-accent rounded-md hover:opacity-75 active:opacity-50 h-full p-2 flex items-center justify-center">
                        <ChevronLeftIcon className='h-5 w-5' />
                    </li>
                </Link>}
                <Link href={`${props.url}${props.current}`}>
                    <li className="bg-secondary text-accent rounded-md hover:opacity-75 active:opacity-50 h-full py-2 px-4 flex items-center justify-center">{props.current}</li>
                </Link>
                {Number(props.current)+1 <= Number(props.total) && <Link href={`${props.url}${Number(props.current)+1}`}>
                    <li className="bg-secondary text-accent rounded-md hover:opacity-75 active:opacity-50 h-full p-2 flex items-center justify-center">
                        <ChevronRightIcon className='h-5 w-5' />
                    </li>
                </Link>}
                {Number(props.current)+1 <= Number(props.total) && <Link href={`${props.url}${props.total}`}>
                    <li className="bg-secondary text-accent rounded-md hover:opacity-75 active:opacity-50 h-full p-2 flex items-center justify-center">
                        <ChevronDoubleRightIcon className='h-5 w-5' />
                    </li>
                </Link>}
            </ul>
        </div>
    )
}

export default Paginate