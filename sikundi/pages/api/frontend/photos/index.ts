import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const photos = await prisma.photos.findMany({
                select: {
                    id: true,
                    title: true,
                    feature_image: {
                        select: {
                            url: true
                        }
                    }
                }
            })

            return res.status(200).json({
                photos
            })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}