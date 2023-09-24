import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export type Error = {
    error: any
}
export type MenuSchema = {
    name: string,
    url: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MenuSchema[] | Error>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token) {
            res.setHeader(
                'Cache-Control',
                'public, s-maxage=10, stale-while-revalidate=59'
            )
            const data = await axios.get(`${process.env.BACKEND_URL}/menu`, {
                headers: {
                    authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
                }
            })
            
            return res.status(200).json(data.data?.map((category:{title:string,latin_title:string})=>({
                name: category.title,
                url: `/category/${category.latin_title}`
            })))
        }
        return res.status(401).json({ error: "token is missing" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}
