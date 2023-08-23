import { GetServerSideProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { Fragment, MouseEventHandler, useEffect, useState } from 'react'
import Hashids from 'hashids'
import axios from 'axios'
import 'dayjs/locale/dv'
import Button from '@DhivehiChannel/components/Button'
import { twMerge } from 'tailwind-merge'
import PostCardBig from '@DhivehiChannel/components/cards/PostCardBig'
import { extractVideoId } from '@DhivehiChannel/libs/youtube'
import { useRouter } from 'next/router'

const Index:NextPage<Props> = (props) => {
    const router = useRouter()
    const { slug } = router.query
    const [posts, setPosts] = useState<article[] | []>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        setPage(1)
        setPosts(props?.articles)
    }, [slug, props?.articles])

    const loadMore:MouseEventHandler<HTMLButtonElement> = async (event) => {
        try {
            setLoading(true)
            const fetchData = await axios.get(`/api/category/${props?.category?.latin_title}?page=${page+1}`, {
                headers: {
                    authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
                }
            })
            const data:any = fetchData.data
            const updatedPosts = [...posts, ...data?.articles]
            setPosts(updatedPosts)
            setPage(page+1)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Fragment>
            <NextSeo title={`${props.category.latin_title} | Dhivehi Channel`} description={""} openGraph={{
                url: `/${props.category.latin_title}`,
                title: `${props.category.latin_title} | Dhivehi Channel`,
                description: "",
                siteName: "Dhivehi Channel",
                images: [

                ]
            }} twitter={{ cardType: "summary_large_image" }} />
            <div className='container mx-auto px-4 mb-12 lg:mb-24 pt-8 lg:pt-12'>
                <div className='flex items-center gap-x-6 mb-3'>
                    <hr className='flex-1 border-secondary' />
                    <h6 className='text-secondary font-black text-2xl'>
                        {props.category.title}
                    </h6>
                    <hr className='flex-1 border-secondary' />
                </div>
                <p className='mb-6 lg:mb-8 w-full text-gray-500 font-medium text-center'>{props?.category?.description}</p>
                <div className='grid grid-cols-4 gap-4 mb-8 lg:mb-14'>
                    {posts?.map((post, index)=>(
                        <PostCardBig key={index} {...post} 
                            className={twMerge([
                                index === 1 ? 'lg:col-span-2 lg:row-span-2 lg:flex lg:flex-col' : 'lg:col-span-1',
                                index === 0 ? 'col-span-4' : 'col-span-2'
                            ])}
                            featureImageClassName={twMerge([
                                index === 1 && 'lg:flex-1'
                            ])} 
                            titleClassName={twMerge([
                                index === 1 && 'lg:text-4xl lg:mb-2'
                            ])} 
                        />
                    ))}
                </div>
                <Button className='text-center min-w-[200px] mx-auto block' onClick={loadMore} loading={loading}>
                    {"އިތުރަށް ލޯރޑް ކުރައްވާ"}
                </Button>
            </div>       
        </Fragment>
    )
}

export default Index

export const getServerSideProps:GetServerSideProps<Props> = async (ctx) => {
    const hashids = new Hashids()
    const category = (await axios.get(`${process.env.BACKEND_URL}/category/${ctx.query.category_slug}`, {
        method: "get",
        headers: {
            authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
        }
    })).data
    

    return { 
        props: JSON.parse(JSON.stringify({
            ...category,
            articles: category?.articles?.map((post:any)=>({
                title: post?.title,
                category: post?.category?.title,
                comments: "",
                feature_image: post?.feature_image?.url || `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/maxresdefault.jpg`,
                feature_image_alt: `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/default.jpg`,
                description: "",
                yt_url: post?.yt_url,
                published_at: post?.published_at,
                url: `/${hashids.encode(post?.id)}`
            })) || []
        }))
    }
}


interface Props {
    articles: article[]
    category: {
        title: string
        latin_title: string
        description: string
    },
    totalPages: number
    current: number
}

interface article {
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