import axios from 'axios'
import Hashids from 'hashids'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const hashid = new Hashids()
    const token = req.headers['authorization']?.split(' ')[1]
    if (process.env.NEXT_PUBLIC_TOKEN === token) {
        try {
            const posts = (await axios.get(`${process.env.BACKEND_URL}/search?query=${req.query.query}`, {
                method: "get",
                headers: {
                    authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
                }
            })).data
            return res.status(200).json({ 
                ...posts, 
                articles: posts?.articles?.map((article:any)=>({
                    ...article,
                    id: hashid.encode(article.id)
                })) 
            })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    return res.status(401).json({ error: "auth token is wrong" })
}

export interface Data {

}