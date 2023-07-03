import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const post_id = parseInt(String(req.query?.post_id))
            if (!post_id) {
                return res.status(500).json({ article: null })
            } else {
                const comment = await prisma.comments.create({
                    data: {
                        content: req.body?.content,
                        created_by: req.body?.created_by,
                        post: {
                            connect: {
                                id: post_id
                            }
                        }
                    },
                    select: {
                        content: true,
                        created_by: true
                    }
                })
                
                return res.status(200).json(comment)
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}