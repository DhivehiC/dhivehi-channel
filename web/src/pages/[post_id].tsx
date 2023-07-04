import { GetServerSideProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { Fragment } from 'react'
import Hashids from 'hashids'
import axios from 'axios'
import Image from 'next/image'

const index:NextPage<Props> = (props) => {
    return (
        <Fragment>
            <NextSeo title={`${props.article.latin_title} | Dhivehi Channel`} description={props.article.description} openGraph={{
                url: `/${props.article.id}`,
                title: `${props.article.title} | Dhivehi Channel`,
                description: props.article.description,
                siteName: "Dhivehi Channel",
                images: [
                    { url: props.article.feature_image.url }
                ]
            }} twitter={{ cardType: "summary_large_image" }} />
            <div className='container px-4 mx-auto'>
                <h1 className='text-3xl font-black'>{props.article.long_title}</h1>
                {
                    props?.article?.feature_image?.url ?
                    <div className='relative aspect-video w-full'>
                        <Image src={props.article.feature_image.url} alt={props.article.long_title} fill className='object-cover' />
                    </div> :
                    <iframe src={props.article.yt_url} className='aspect-video w-full' />
                }
            </div>
        </Fragment>
    )
}

export default index

export const getServerSideProps:GetServerSideProps<Props> = async (ctx) => {
    const hashids = new Hashids()
    const post:Props = (await axios.get(`${process.env.BACKEND_URL}/${hashids.decode(String(ctx?.query?.post_id))}`, {
        method: "get",
        headers: {
            authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
        }
    })).data
    

    return { 
        props: { ...post, article: {...post.article, id: hashids.encode(post.article.id)} }
    }
}


interface Props {
    article: {
        id: string
        title: string
        latin_title: string
        long_title: string
        description: string
        yt_url: string
        created_by: {
            user_name: string
        }
        feature_image: {
            url: string
            feature_image_caption: string
        }
        content: string
        post_tags: {
            tag: {
                title: string
            }
        }[]
        category: {
            title: string
            latin_title: string
        }
        comments: {
            id: string
            created_by: string
            content: string
        }[]
        breaking: boolean
        published_at: string
    },
    relatedArticles: {
        id: number
        title: string
        published_at: string
        feature_image: {
            url: string
        }
    }[]
}