import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const current = Number(req.query.page) || 0
    const per_page = Number(req.query.per_page) || 9
    const category_slug = String(req.query?.category_slug)
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            if (!category_slug) {
                return res.status(500).json({ category: null })
            } else {
                const articles = await prisma.posts.findMany({
                    select: {
                        id: true,
                        title: true,
                        yt_url: true,
                        feature_image: {
                            select: {
                                url: true
                            }
                        },
                        category: {
                            select: {
                                title: true,
                                latin_title: true
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
                    take: per_page,
                    skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
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
                const category = await prisma.categories.findFirst({
                    select: {
                        title: true,
                        latin_title: true,
                        description: true
                    },
                    where: {
                        latin_title: String(category_slug)
                    }
                })
                
                return res.status(200).json({ 
                    articles: articles,
                    category: category,
                    totalPages: (Number(totalArticles._count)/per_page),
                    current: current === 0 ? 1 : current
                })
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}
