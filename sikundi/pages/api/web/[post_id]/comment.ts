import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import Hashids from 'hashids'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/dv'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        dayjs.extend(relativeTime)
        const hashids = new Hashids()
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            if (!req.query?.post_id) {
                return res.status(500).json({ article: null })
            } else {
                const post_id = parseInt(String(hashids.decode(String(req.query.post_id))))
                const data = JSON.parse(req.body)
                const comment = await prisma.comments.create({
                    data: {
                        content: data.comment,
                        created_by: data.name,
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