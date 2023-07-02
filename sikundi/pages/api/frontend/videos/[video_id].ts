import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const video_id = parseInt(String(req.query?.video_id))
            if (!video_id) {
                return res.status(500).json({ video: null })
            } else {
                const video = await prisma?.videos.findUnique({
                    select: {
                        id: true,
                        title: true,
                        latin_title: true,
                        long_title: true,
                        created_by: {
                            select: {
                                user_name: true
                            }
                        },
                        yt_url: true,
                        content: true,
                        published_at: true,
                    },
                    where: {
                        id: video_id
                    }
                })
                
                return res.status(200).json({ video })
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}