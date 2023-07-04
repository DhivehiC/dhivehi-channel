import Image from 'next/image'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/dv'

const PostCard:FC<PostCardProps> = (props) => {
    const [url, setUrl] = useState(props.feature_image)
    dayjs.extend(relativeTime)
    return (
        <Link href={props.url} className={twMerge([
            'group flex lg:gap-4 gap-2 first-of-type:flex-col lg:first-of-type:flex-row',
            props?.className
        ])}>
            <div className={twMerge([
                'w-full aspect-video relative rounded-lg overflow-hidden lg:mb-2 flex-1',
                props?.featureImageClassName
            ])}>
                <Image src={url} alt={props.title} fill className='object-cover group-hover:scale-110 transition-all' onError={()=>{
                    setUrl(props.feature_image_alt)
                }} />
                <span className='w-full h-full bg-gradient-to-b from-black to-[#00000010] absolute opacity-50' />
            </div>
            <div className='flex-1 lg:py-4'>
                <h5 className={twMerge([
                    'text-primary font-bold text-lg lg:text-3xl lg:mb-3 mb-1',
                    props?.titleClassName
                ])}>{props?.title}</h5>
                <p className='text-accent line-clamp-3 leading-7 lg:mb-4 mb-0'>
                    <span className='hidden lg:block'>{props?.description}</span>
                </p>
                <h6 className='text-accent lg:text-sm text-xs'>
                    {`${props?.category} - ${dayjs(props?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")}`}
                </h6>
            </div>
        </Link>
    )
}

export default PostCard

export interface PostCardProps {
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
}