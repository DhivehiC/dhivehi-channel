import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import Hashids from 'hashids'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/dv'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const current = req.query.page || 1
    const per_page = 8
    try {
        dayjs.extend(relativeTime)
        const hashids = new Hashids()
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const category_slug = String(req.query?.category_slug)
            if (!category_slug) {
                return res.status(500).json({ category: null })
            } else {
                const category = await prisma.categories.findFirst({
                    select: {
                        title: true,
                        latin_title: true
                    },
                    where: {
                        latin_title: String(category_slug)
                    }
                })
                if (category) {
                    const articles = await prisma.posts.findMany({
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            feature_image: {
                                select: {
                                    url: true,
                                    base64: true
                                }
                            },
                            category: {
                                select: {
                                    title: true
                                }
                            },
                            published_at: true
                        },
                        where: {
                            category: {
                                latin_title: String(category_slug)
                            },
                            published_at: {
                                lte: new Date()
                            },
                        },
                        orderBy: {
                            published_at: 'desc'
                        },
                        take: (Number(current)-1) === 0 ? (per_page+1) : per_page,
                        skip: Number(current)-1 === 0 ? 0 : ((Number(current)-1)*per_page)+1
                    })
                    const totalArticles = await prisma.posts.aggregate({
                        _count: true,
                        where: {
                            category: {
                                latin_title: String(category_slug)
                            },
                            published_at: {
                                lte: new Date()
                            }
                        }
                    })
                    
                    return res.status(200).json({ 
                        articles: articles.map((post)=>({
                            ...post,
                            id: hashids.encode(parseInt(String(post?.id))), 
                            published_at: dayjs(post?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")
                        })),
                        category: category,
                        totalPages: (Number(totalArticles._count)/per_page),
                        current: current
                    })
                }
                return res.status(401).json({ error: `${category_slug} doesn't exists` })
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}