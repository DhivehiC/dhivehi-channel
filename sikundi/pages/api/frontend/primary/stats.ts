import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const total = await prisma.voteBoxes.count()
            const box = await prisma.voteBoxes.count({
                where: {
                    anni: {
                        gt: 0
                    },
                    ibu: {
                        gt: 0
                    }
                }
            })
            res.status(200).json({box, total})
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}