import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "GET") {
        try {

            const token = req.cookies.token
            const secret = process.env.ACCESS_TOKEN_SECRET
            jwt.verify(String(token), String(secret), async (err:any, user:any)=>{
                if (err) {
                    res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    try {
                        const urls = await fetch('https://api.cloudflare.com/client/v4/accounts/66cb0c5b280cab4b1899105ef3cc60cd/images/v2/direct_upload', {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer pmW7I0-47WymDf9pzn8CXBpFqkLpxZYv4bmgbcZR' 
                            }
                        })
                        const urlJSON = await urls.json()
                        res.status(200).json(urlJSON)
                    } catch (error) {
                        res.status(500).json({ error })
                    }
                }
            })

        } catch (error) {
            res.status(500).json({ error })
        }
    } else {
        res.status(401).json({ error: `${req.method} is not allowed in this route.` })
    }
}