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
                const today = new Date(String(new Date().toISOString()).split('T')[0])
                const viewCount = await prisma?.viewCount?.findFirst({
                    select: {
                        id: true,
                        count: true
                    },
                    where: {
                        post_id: post_id,
                        created_at: today
                    }
                })
                const totalViewCount = await prisma.posts.findUnique({
                    select: {
                        total_view_count: true,
                        id: true
                    },
                    where: {
                        id: post_id
                    }
                })
                let totalViews
                if (totalViewCount) {
                    totalViews = await prisma.posts.update({
                        select: {
                            id: true,
                            total_view_count: true
                        },
                        data: {
                            total_view_count: totalViewCount.total_view_count+1
                        },
                        where: {
                            id: totalViewCount.id
                        }
                    })
                }
                if (viewCount) {
                    const view = await prisma?.viewCount?.update({
                        data: {
                            count: Number(viewCount?.count) + 1
                        },
                        select: {
                            created_at: true,
                            post_id: true,
                            count: true
                        },
                        where: {
                            id: viewCount?.id
                        }
                    })
                    return res.status(200).json({ message: "view updated", view, totalViews })
                } else {
                    const view = await prisma?.viewCount?.create({
                        data: {
                            count: 1,
                            post: {
                                connect: {
                                    id: post_id
                                }
                            }
                        },
                        select: {
                            created_at: true,
                            post_id: true,
                            count: true
                        },
                    })
                    return res.status(200).json({ message: "view created", view, totalViews })
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}