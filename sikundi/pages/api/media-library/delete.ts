import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { prisma } from '@sikundi/libs/server/prisma'
import axios from 'axios'

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
                        if (req.query.id) {
                            const media = await prisma?.mediaLibrary.delete({
                                select: {
                                    id: true,
                                    url: true,
                                },
                                where: {
                                    id: parseInt(String(req.query.id))
                                }
                            })
                            await axios.delete(String(media?.url), {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'api-key': 'rP3T4X2bwO9Y6jU7dFqE1cL5iG8vN0zMnBhKlS'
                                }
                            })
                            res.status(200).json({ 
                                title: `Media Deletion`, 
                                content: `media successfully deleted`,
                                type: "success"
                            })
                        } else{
                            res.status(401).json({ 
                                title: `Media Deletion`, 
                                content: `An unknown error has occured`,
                                type: "failed"
                            })
                        }
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