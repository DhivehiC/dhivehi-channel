import React, { FC, Fragment } from 'react'
import PostCard, { PostCardProps } from '@DhivehiChannel/components/cards/PostCard'
import Button from '../Button'
import AdCard from '../cards/AdCard'
import { twMerge } from 'tailwind-merge'

const AdCategoryBlock:FC<AdCategoryBlockProps> = (props) => {
    return (
        <Fragment>
            <div className='container mx-auto px-4 mb-12 lg:mb-24'>
                <div className='flex items-center gap-x-6 mb-6 lg:mb-8'>
                    <h6 className='text-secondary font-black text-2xl'>
                        {props.title}
                    </h6>
                    <hr className='flex-1 border-secondary' />
                </div>
                <div className='grid grid-cols-12 gap-4 mb-8'>
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
                <Button className='text-center min-w-[200px] mx-auto block'>
                    {"އިތުރަށް ލޯރޑް ކުރައްވާ"}
                </Button>
            </div>
        </Fragment>
    )
}

export default AdCategoryBlock

export interface AdCategoryBlockProps {
    block_name: "ad_category_block",
    title: string,
    load_more_url: {
        method: "get" | "post",
        url: string,
        headers: {
            [name:string]: string | number
        },
        body: {
            [name:string]: string | number
        }
    },
    posts: PostCardProps[]
}