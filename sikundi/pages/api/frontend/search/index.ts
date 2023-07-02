import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const current = req.query.page || 0
    const per_page = 9
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const query = String(req.query?.query)
            if (!query) {
                return res.status(500).json({ posts: null })
            } else {
                const articles = await prisma.posts.findMany({
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        feature_image: {
                            select: {
                                url: true
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
                        title: {
                            contains: query
                        },
                        published_at: {
                            lte: new Date()
                        }
                    },
                    orderBy: {
                        published_at: 'desc'
                    },
                    take: per_page,
                    skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
                })
                const totalArticles = await prisma.posts.aggregate({
                    _count: true,
                    where: {
                        title: {
                            contains: query
                        },
                        published_at: {
                            lte: new Date()
                        }
                    }
                })
                
                return res.status(200).json({ 
                    articles: articles,
                    totalPages: (Number(totalArticles._count)/per_page),
                    current: current === 0 ? 1 : current
                })
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}