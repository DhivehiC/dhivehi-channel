import { extractVideoId } from '@DhivehiChannel/libs/youtube'
import axios from 'axios'
import Hashids from 'hashids'
import type { NextApiRequest, NextApiResponse } from 'next'

export type Error = {
    error: any
}
export interface CategorySchema {
    articles: {
        id: number
        title: string
        description: string
        feature_image:{
            url: string
            base64: string
        }
        category: {
            title: string
        }
        published_at: string
    }[]
    category: {
        title: string
        latin_title: string
    }
    totalPages: number
    current: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const hashids = new Hashids()
        const token = req.headers['authorization']?.split(' ')[1]
        if (token) {
            const data = (await axios.get(`${process.env.BACKEND_URL}/category/${req.query?.slug}?page=${req.query?.page}`, {
                headers: {
                    authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
                }
            })).data
            const posts = data?.articles?.map((post:any)=>({
                title: post?.title,
                category: post?.category?.title,
                comments: "",
                feature_image: post?.feature_image?.url || `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/maxresdefault.jpg`,
                feature_image_alt: `https://img.youtube.com/vi/${extractVideoId(String(post?.yt_url))}/default.jpg`,
                description: "",
                yt_url: post?.yt_url,
                published_at: post?.published_at,
                url: `/${hashids.encode(post?.id)}`
            }))
            return res.status(200).json({ articles: posts, category: undefined })
        }
        return res.status(401).json({ error: "token is missing" })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}