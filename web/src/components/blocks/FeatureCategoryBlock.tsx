import React, { FC, Fragment } from 'react'
import PostCardBig, { PostCardBigProps } from '@DhivehiChannel/components/cards/PostCardBig'
import { twMerge } from 'tailwind-merge'
import Button from '@DhivehiChannel/components/Button'

const FeatureCategoryBlock:FC<FeatureCategoryBlockProps> = (props) => {
    return (
        <Fragment>
            <div className='container mx-auto px-4 mb-12 lg:mb-24'>
                <div className='flex items-center gap-x-6 mb-6 lg:mb-8'>
                    <hr className='flex-1 border-secondary' />
                    <h6 className='text-secondary font-black text-2xl'>
                        {props.title}
                    </h6>
                    <hr className='flex-1 border-secondary' />
                </div>
                <div className='grid grid-cols-4 gap-4 mb-8 lg:mb-14'>
                    {props?.posts?.map((post, index)=>(
                        <PostCardBig key={index} {...post} 
                            className={twMerge([
                                index === 1 ? 'lg:col-span-2 lg:row-span-2' : 'lg:col-span-1',
                                index === 0 ? 'col-span-4' : 'col-span-2'
                            ])}
                            featureImageClassName={twMerge([
                                index === 1 && 'lg:h-[calc(100%-100px)]'
                            ])} 
                            titleClassName={twMerge([
                                index === 1 && 'lg:text-4xl lg:mb-2'
                            ])} 
                        />
                    ))}
                </div>
                {/* <Button className='text-center min-w-[200px] mx-auto block'>
                    {"އިތުރަށް ލޯރޑް ކުރައްވާ"}
                </Button> */}
            </div>
        </Fragment>
    )
}

export default FeatureCategoryBlock

export interface FeatureCategoryBlockProps {
    block_name: "feature_category_block",
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
    posts: PostCardBigProps[]
}