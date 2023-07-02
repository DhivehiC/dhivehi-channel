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
                const article = await prisma?.posts.findUnique({
                    select: {
                        id: true,
                        title: true,
                        feature_image: {
                            select: {
                                url: true,
                                id: true,
                            }
                        },
                    },
                    where: {
                        id: post_id
                    }
                })
                
                return res.status(200).json({ article })
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}