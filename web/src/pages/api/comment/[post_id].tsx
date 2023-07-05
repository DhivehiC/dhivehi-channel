import axios from 'axios'
import Hashids from 'hashids'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const hashid = new Hashids()
    const token = req.headers['authorization']?.split(' ')[1]
    if (process.env.NEXT_PUBLIC_TOKEN === token) {
        try {
            const comment = (await axios.post(`${process.env.BACKEND_URL}/${hashid.decode(String(req.query.post_id))}/comment`, {
                content: req.body.content,
                created_by: req.body.name
            }, {
                headers: {
                    authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
                },
            })).data
            return res.status(200).json(comment)
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    return res.status(401).json({ error: "auth token is wrong" })
}

export interface Data {

}