import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "GET") {
        try {
            const token = req.cookies.token
            const secret = process.env.ACCESS_TOKEN_SECRET
            const search = req.query['query']
            jwt.verify(String(token), String(secret), async (err:any, user:any)=>{
                if (err) {
                    return res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    try {
                        if (search && search.length > 0) {
                            const tags = await prisma.tags.findMany({
                                select: {
                                    id: true,
                                    title: true
                                },
                                where: {
                                    title: {
                                        contains: String(search)
                                    }
                                },
                                take: 10
                            })
                            return res.status(200).json(tags)
                        } else {
                            const tags = await prisma.tags.findMany({
                                select: {
                                    id: true,
                                    title: true
                                },
                                where: {
                                    OR: [
                                        {
                                            id: {
                                                equals: 1
                                            }
                                        },
                                        {
                                            id: {
                                                equals: 2
                                            }
                                        }
                                    ]
                                }
                            })
                            return res.status(200).json(tags)
                        }
                    } catch (error) {
                        return res.status(500).json({ error })
                    }
                }
            })
        } catch (error) {
            return res.status(500).json({ error })
        }
    } else {
        return res.status(401).json({ error: `${req.method} is not allowed in this route.` })
    }
}