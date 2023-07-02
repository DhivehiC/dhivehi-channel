import Image from 'next/image'
import Link from 'next/link'
import React, { FC, Fragment } from 'react'
import { HiPlayCircle } from 'react-icons/hi2'
import PostCardBig, { PostCardBigProps } from '@DhivehiChannel/components/cards/PostCardBig'

const FeatureBlock:FC<FeatureBlockProps> = (props) => {
    return (
        <Fragment>
            {
                props?.posts[0] && 
                <Link href={props?.posts[0]?.url} className='min-h-[90vh] w-full bg-accent relative group overflow-hidden block'>
                    <Image src={props?.posts[0]?.feature_image} alt={props?.posts[0]?.title} fill className='object-cover absolute group-hover:scale-105 transition-all' />
                    <span className='w-full h-full bg-gradient-to-b from-black to-[#00000075] absolute opacity-90 top-0 left-0' />
                    <div className='absolute inset-0 flex items-end'>
                        <div className='container w-full mx-auto p-4 mb-10'>
                            <h6 className='text-white mb-5'>{`${props?.posts[0]?.category} - ${props?.posts[0]?.comments} ކޮމެންޓް`}</h6>
                            <h1 className='text-white text-5xl font-black mb-10 lg:max-w-[50%] md:max-w-[75%] leading-snug'>{props?.posts[0]?.title}</h1>
                            <p className='text-white inline-flex items-center gap-2 hover:opacity-50 active:opacity-25 font-bold text-lg'>
                                <HiPlayCircle className='text-3xl' />
                                {"ވީޑިއޯ ފައްޓާ"}
                            </p>
                        </div>
                    </div>
                </Link>
            }
            <div className='container mx-auto grid grid-cols-3 gap-x-4 gap-y-6 -mt-8 px-4 mb-12 lg:mb-24'>
                {props?.posts?.map((post, index)=>(
                    index !== 0 &&
                    <PostCardBig key={index} {...post} className="col-span-3 lg:col-span-1" />
                ))}
            </div>
        </Fragment>
    )
}

export default FeatureBlock

export interface FeatureBlockProps {
    block_name: "feature_block",
    posts: PostCardBigProps[]
}