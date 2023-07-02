import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const current = req.query.page || 0
    const per_page = 4
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const boxes = await prisma.voteBoxes.findMany({
                select: {
                    box_number: true,
                    name: true,
                    ibu: true,
                    anni: true,
                    eligible: true,
                    no_show: true,
                    void: true
                },
                orderBy: {
                    updated_at: 'desc'
                },
                take: per_page,
                skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
            })
            res.status(200).json(boxes)
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}