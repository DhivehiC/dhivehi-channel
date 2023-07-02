import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const menu = await prisma.categories.findMany({
                select: {
                    title: true,
                    latin_title: true
                },
                where: {
                    published_at: {
                        not: null
                    }
                }
            })

            return res.status(200).json(menu)
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}