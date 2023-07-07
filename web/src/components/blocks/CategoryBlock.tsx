import React, { FC, Fragment } from 'react'
import PostCardBig, { PostCardBigProps } from '@DhivehiChannel/components/cards/PostCardBig'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'

const CategoryBlock:FC<CategoryBlockProps> = (props) => {
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
                <div className='grid grid-cols-4 gap-4 mb-8 w-full'>
                    {props?.posts?.map((post, index)=>(
                        <PostCardBig key={index} {...post} 
                            className={twMerge([
                                index === 0 ? 'lg:col-span-2 lg:row-span-2 col-span-4' : 'lg:col-span-1 col-span-2',
                            ])}
                            featureImageClassName={twMerge([
                                index === 0 && 'lg:h-[calc(83%)]'
                            ])} 
                            titleClassName={twMerge([
                                index === 0 && 'lg:text-4xl lg:mb-5',
                                'text-start'
                            ])} 
                            categoryClassName={twMerge('text-start')} 
                        />
                    ))}
                </div>
                <Link href={props.load_more_url} className='text-center min-w-[200px] bg-primary text-white py-3 px-6 rounded-lg hover:opacity-75 active:opacity-50'>
                    {"އިތުރަށް ލޯރޑް ކުރައްވާ"}
                </Link>
            </div>
        </Fragment>
    )
}

export default CategoryBlock

export interface CategoryBlockProps {
    block_name: "category_block",
    title: string,
    description: string,
    load_more_url: string,
    posts: PostCardBigProps[]
}