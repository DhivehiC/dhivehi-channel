import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/dv'

const FeatureCard:FC<FeatureCardProps> = (props) => {
    dayjs.extend(relativeTime)
    return (
        <Link href={props?.url} className='group aspect-[4/5] lg:min-w-[calc(25%-12px)] md:min-w-[calc(50%-12px)] min-w-[calc(100%-12px)]'>
            <div className={'w-full h-full relative rounded-lg overflow-hidden lg:mb-2'}>
                <Image src={props.feature_image} alt={props.title} fill className='object-cover group-hover:scale-110 transition-all' />
                <span className='w-full h-full bg-gradient-to-b from-black to-[#00000010] absolute opacity-50' />
            </div>
            <h1 className='text-primary text-center font-bold text-xl line-clamp-1 leading-loose'>{props.title}</h1>
            <h6 className='text-accent text-center text-sm mb-4'>
                {`${props?.category} - ${dayjs(props?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")}`}
            </h6>
        </Link>
    )
}

export default FeatureCard

export interface FeatureCardProps {
    title: string,
    description: string,
    category: string,
    published_at: string,
    comments: number,
    feature_image: string,
    url: string,
    className?: string
    featureImageClassName?: string
    titleClassName?: string
}