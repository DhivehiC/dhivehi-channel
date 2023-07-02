import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const islands = await prisma.islands.findMany({
                select: {
                    name: true,
                    id: true,
                },
                orderBy: {
                    id: "asc"
                },
            })
            res.status(200).json(islands)
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}