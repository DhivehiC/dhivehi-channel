import React, { FC, Fragment } from 'react'
import PostCard, { PostCardProps } from '@DhivehiChannel/components/cards/PostCard'
import Button from '../Button'
import AdCard from '../cards/AdCard'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'

const AdCategoryBlock:FC<AdCategoryBlockProps> = (props) => {
    return (
        <Fragment>
            <div className='container mx-auto px-4 mb-12 lg:mb-24 flex flex-col items-center'>
                <div className='flex items-center gap-x-6 mb-3 w-full'>
                    <h6 className='text-secondary font-black text-2xl'>
                        {props.title}
                    </h6>
                    <hr className='flex-1 border-secondary' />
                </div>
                <p className='mb-6 lg:mb-8 w-full text-gray-500 font-medium'>{props?.description}</p>
                <div className='grid grid-cols-12 gap-4 mb-8 w-full'>
                    <div className='lg:col-span-8 col-span-12'>
                        {props?.posts?.map((post, index)=>(
                            <PostCard key={index} {...post} className={twMerge([
                                'mb-2',
                                index === 0 && "mb-8"
                            ])} />
                        ))}
                    </div>
                    <div className='lg:col-span-4 col-span-12 relative'>
                        <AdCard />
                    </div>
                </div>
                <Link href={props.load_more_url} className='text-center min-w-[200px] bg-primary text-white py-3 px-6 rounded-lg hover:opacity-75 active:opacity-50'>
                    {"އިތުރަށް ލޯރޑް ކުރައްވާ"}
                </Link>
            </div>
        </Fragment>
    )
}

export default AdCategoryBlock

export interface AdCategoryBlockProps {
    block_name: "ad_category_block"
    title: string
    description?: string
    load_more_url: string
    posts: PostCardProps[]
}