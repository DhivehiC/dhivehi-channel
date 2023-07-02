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
                                url: true,
                                base64: true
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

                if (article) {
                    const relatedArticles = await prisma.posts.findMany({
                        select: {
                            id: true,
                            title: true,
                            published_at: true,
                            feature_image: {
                                select: {
                                    url: true,
                                    base64: true
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
                    return res.status(200).json({ 
                        article: {
                            ...article, 
                            id: hashids.encode(parseInt(String(article?.id))), 
                            published_at: dayjs(article?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")
                        }, 
                        relatedArticles: relatedArticles?.map((post)=>({
                            ...post,
                            id: hashids.encode(parseInt(String(post?.id))), 
                            published_at: dayjs(post?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")
                        }))
                    })
                }
                return res.status(401).json({ error: `${post_id} doesn't exists` })
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}