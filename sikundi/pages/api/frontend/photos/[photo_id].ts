import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const photo_id = parseInt(String(req.query?.photo_id))
            if (!photo_id) {
                return res.status(500).json({ photo: null })
            } else {
                const photo = await prisma?.photos.findUnique({
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
                        feature_image: {
                            select: {
                                url: true
                            }
                        },
                        feature_image_caption: true,
                        content: true,
                        published_at: true,
                    },
                    where: {
                        id: photo_id
                    }
                })
                
                return res.status(200).json({ photo })
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}