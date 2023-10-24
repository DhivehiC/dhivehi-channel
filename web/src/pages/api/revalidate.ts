import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.query.secret !== process.env.REVALIDATION_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }
  
    try {

        // for (let i = 0; i < req.body?.paths?.length; i++) {
        //     console.log(req.body?.paths[i])
        //     await res.revalidate(req.body?.paths[i])
        // }

        return res.json({ revalidated: true })
    } catch (err) {
        return res.status(500).json({ revalidated: false, error: err })
    }
}