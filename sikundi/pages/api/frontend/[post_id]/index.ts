import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const post_id = parseInt(String(req.query?.post_id))
            if (!post_id) {
                return res.status(500).json({ article: null })
            } else {
                const article = await prisma?.posts.findFirst({
                    select: {
                        id: true,
                        title: true,
                        latin_title: true,
                        long_title: true,
                        description: true,
                        created_by: {
                            select: {
                                user_name: true
                            }
                        },
                        feature_image: {
                            select: {
                                url: true
                            }
                        },
                        feature_image_caption: true,
                        content: true,
                        post_tags: {
                            select: {
                                tag: {
                                    select: {
                                        title: true
                                    }
                                }
                            }
                        },
                        category: {
                            select: {
                                title: true,
                                latin_title: true
                            }
                        },
                        comments: {
                            select: {
                                id: true,
                                created_by: true,
                                content: true
                            },
                            where: {
                                published_at: {
                                    not: null
                                }
                            }
                        },
                        breaking: true,
                        published_at: true,
                    },
                    where: {
                        id: post_id,
                        published_at: {
                            lte: new Date()
                        }
                    }
                })

                const relatedArticles = await prisma.posts.findMany({
                    select: {
                        id: true,
                        title: true,
                        published_at: true,
                        feature_image: {
                            select: {
                                url: true
                            }
                        }
                    },
                    where: {
                        id: {
                            not: {
                                equals: article?.id
                            }
                        },
                        published_at: {
                            lte: new Date()
                        },
                        OR: article?.post_tags?.map((item)=>{
                            if (item?.tag?.title !== "ބޮޑު" && item?.tag?.title !== "ކުޑަ") {
                                return ({
                                    post_tags: {
                                        some: {
                                            tag: {
                                                title: {
                                                    equals: item?.tag?.title
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                            return {}
                        })
                    },
                    orderBy: {
                        published_at: "desc"
                    },
                    take: 4
                })
                
                return res.status(200).json({ article, relatedArticles })
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}