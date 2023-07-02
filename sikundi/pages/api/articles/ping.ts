import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "GET") {
        try {
            const token = req.cookies.token
            const secret = process.env.ACCESS_TOKEN_SECRET
            jwt.verify(String(token), String(secret), async (err:any, user:any)=>{
                if (err) {
                    return res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    const postId = parseInt(String(req.query['id']))
                    const now = new Date().toISOString()
                    if (postId) {
                        const ping = await prisma.posts.update({
                            select: {
                                updated_by: true
                            },
                            data: {
                                updated_by: {
                                    user: { id: user.id, email: user.email, user_name: user.user_name },
                                    timestampz: now
                                }
                            },
                            where: {
                                id: postId
                            }
                        })
                        return res.status(200).json(ping)
                    }
                    return res.status(500).json({
                        error: "no article"
                    })
                }
            })
        } catch (error) {
            return res.status(500).json({ error })
        }
    } else {
        return res.status(401).json({ error: `${req.method} is not allowed in this route.` })
    }
}