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
            const posts = (await prisma.posts.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: {
                        select: {
                            title: true
                        }
                    },
                    content: true,
                    feature_image: {
                        select: {
                            url: true
                        }
                    },
                    published_at: true,
                    created_by: {
                        select: {
                            user_name: true
                        }
                    }
                },
                where: {
                    published_at: {
                        not: null
                    }
                },
                take: 20,
                orderBy: {
                    published_at: "desc"
                }
            })).map((post)=>({
                ...post,
                id: hashids.encode(parseInt(String(post?.id))), 
                published_at: dayjs(post?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")
            }))

            return res.status(200).json(posts)
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}