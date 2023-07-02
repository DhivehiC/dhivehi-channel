import React, { FC } from 'react'
import { PostCardBigProps } from '@DhivehiChannel/components/cards/PostCardBig'
import Link from 'next/link'
import Image from 'next/image'

const FeaturePostBlock:FC<FeaturePostBlockProps> = (props) => {
    return (
        <Link href={props?.post?.url} className='min-h-[50vh] w-full bg-accent relative group overflow-hidden block mb-12 lg:mb-24'>
            <Image src={props?.post?.feature_image} alt={props?.post?.title} fill className='object-cover absolute group-hover:scale-105 transition-all' />
            <span className='w-full h-full bg-gradient-to-b from-black to-[#00000075] absolute opacity-90 top-0 left-0' />
            <div className='absolute inset-0 flex items-end'>
                <div className='container w-full mx-auto p-4'>
                    <h6 className='text-white mb-5'>{`${props?.post?.category} - ${props?.post?.comments} ކޮމެންޓް`}</h6>
                    <h1 className='text-white text-5xl font-black mb-10 lg:max-w-[50%] md:max-w-[75%] leading-snug'>{props?.post?.title}</h1>
                </div>
            </div>
        </Link>
    )
}

export default FeaturePostBlock

export interface FeaturePostBlockProps {
    block_name: "feature_post_block",
    title: string,
    sub_title: string,
    post: PostCardBigProps
}