import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    fetch(`https://publish.twitter.com/oembed?url=${req.query.url}`, {
        method: "GET",
        mode: "cors"
    }).then(async (resp)=>{
        if (resp.status === 200) {
            const url = await resp.json()
            res.status(200).json(url)
        } else {
            res.status(resp.status).json({})
        }
    }).catch((e)=>{
        console.log(e)
        res.status(500).json({e})
    })
}