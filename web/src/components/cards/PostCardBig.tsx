import Image from 'next/image'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/dv'

const PostCardBig:FC<PostCardBigProps> = (props) => {
    const [url, setUrl] = useState(props.feature_image)
    dayjs.extend(relativeTime)
    return (
        <Link href={props.url} className={twMerge([
            'group',
            props?.className
        ])}>
            <div className={twMerge([
                'w-full aspect-video relative rounded-lg overflow-hidden lg:mb-2',
                props?.featureImageClassName
            ])}>
                <Image src={url} alt={props.title} fill className='object-cover group-hover:scale-110 transition-all' onError={()=>{
                    setUrl(props.feature_image_alt)
                }} />
                <span className='w-full h-full bg-gradient-to-b from-black to-[#00000010] absolute opacity-50' />
            </div>
            <h5 className={twMerge([
                'text-center text-primary font-bold text-lg lg:text-xl lg:mb-2 mb-1',
                props?.titleClassName
            ])}>{props?.title}</h5>
            <h6 className={twMerge([
                'text-center text-accent lg:text-sm text-xs', 
                props?.categoryClassName
            ])}>
                {`${props?.category} - ${dayjs(props?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")}`}
            </h6>
        </Link>
    )
}

export default PostCardBig

export interface PostCardBigProps {
    title: string,
    description: string,
    category: string,
    published_at: string,
    comments: number,
    feature_image: string,
    feature_image_alt: string,
    url: string,
    className?: string
    featureImageClassName?: string
    titleClassName?: string
    yt_url?: string
    categoryClassName?: string
}