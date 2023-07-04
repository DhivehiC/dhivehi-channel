import { GetServerSideProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { Fragment } from 'react'
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
        props: post
    }
}


interface Props {
    article: {
        id: number
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