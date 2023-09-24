import { GetServerSideProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { Fragment } from 'react'
import AdCategoryBlock, { AdCategoryBlockProps } from '@DhivehiChannel/components/blocks/AdCategoryBlock'
import CarouselBlock, { CarouselBlockProps } from '@DhivehiChannel/components/blocks/CarouselBlock'
import CategoryBlock, { CategoryBlockProps } from '@DhivehiChannel/components/blocks/CategoryBlock'
import FeatureBlock, { FeatureBlockProps } from '@DhivehiChannel/components/blocks/FeatureBlock'
import FeatureCategoryBlock, { FeatureCategoryBlockProps } from '@DhivehiChannel/components/blocks/FeatureCategoryBlock'
import FeaturePostBlock, { FeaturePostBlockProps } from '@DhivehiChannel/components/blocks/FeaturePostBlock'
import { extractVideoId } from '@DhivehiChannel/libs/youtube'
import Hashids from 'hashids'
import axios from 'axios'

const index:NextPage<Props> = (props) => {
    return (
        <Fragment>
            <NextSeo title={"Dhivehi Channel"} description={"This is the streaming platform for dhivehi channel"} openGraph={{
                url: "",
                title: "",
                description: "",
                siteName: "",
                images: [
                    { url: "" }
                ]
            }} twitter={{ cardType: "summary_large_image" }} />
            {props.blocks.map((blockDetails, index)=>(

                (blockDetails.block_name === "feature_block" && blockDetails.posts?.length > 0) && 
                    <FeatureBlock key={index} {...blockDetails} />
                ||

                (blockDetails.block_name === "feature_category_block" && blockDetails.posts?.length > 0) && 
                    <FeatureCategoryBlock key={index} {...blockDetails} />
                ||

                null
            ))}
        </Fragment>
    )
}

export default index

export const getServerSideProps:GetServerSideProps<Props> = async (ctx) => {
    const hashids = new Hashids()
    const posts = (await axios.get(`${process.env.BACKEND_URL}`, {
        method: "get",
        headers: {
            authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
        }
    })).data

    const blocks:block[] = [

        {
            block_name: "feature_block",
            posts: [
                ...posts?.mainPost?.map((post:any)=>({
                    title: post?.title,
                    category: post?.category?.title,
                    comments: post?._count?.comments,
                    feature_image: post?.feature_image?.url || `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/maxresdefault.jpg`,
                    feature_image_alt: `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/default.jpg`,
                    description: post?.description,
                    yt_url: post?.yt_url,
                    published_at: post?.published_at,
                    url: `/${hashids.encode(post?.id)}`
                })),
                ...posts?.bigPost?.map((post:any)=>({
                    title: post?.title,
                    category: post?.category?.title,
                    comments: post?._count?.comments,
                    feature_image: post?.feature_image?.url || `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/maxresdefault.jpg`,
                    feature_image_alt: `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/default.jpg`,
                    description: post?.description,
                    yt_url: post?.yt_url,
                    published_at: post?.published_at,
                    url: `/${hashids.encode(post?.id)}`
                }))
            ] || [],
        },
        {
            block_name: "feature_category_block",
            title: "އެޑިޓާރސް ޕިކްސް",
            posts: posts?.smallPost?.map((post:any)=>({
                title: post?.title,
                category: post?.category?.title,
                comments: post?._count?.comments,
                feature_image: post?.feature_image?.url || `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/maxresdefault.jpg`,
                feature_image_alt: `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/default.jpg`,
                description: post?.description,
                published_at: post?.published_at,
                url: `/${hashids.encode(post?.id)}`,
            })) || [],
            load_more_url: {
                method: "get",
                url: "",
                headers: {},
                body: {}
            }
        }
    ]

    return { 
        props: {
            blocks: JSON.parse(JSON.stringify(blocks))
        }
    }
}

type block = AdCategoryBlockProps | CarouselBlockProps | CategoryBlockProps | FeatureBlockProps | FeatureCategoryBlockProps | FeaturePostBlockProps

interface Props {
    blocks: block[]
}