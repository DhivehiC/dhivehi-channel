import axios from 'axios'
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

export default async function handler(req: NextApiRequest, res: NextApiResponse<CategorySchema[] | Error>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token) {
            const data = await axios.get(`${process.env.BACKEND_URL}/category/${req.query?.slug}?page=${req.query?.page}`, {
                headers: {
                    authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
                }
            })
            return res.status(200).json({ ...data.data, category: undefined })
        }
        return res.status(401).json({ error: "token is missing" })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}