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
            const breakingPost = await prisma.posts.findFirst({
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
                    breaking: true,
                    published_at: {
                        lte: new Date()
                    }
                },
                orderBy: {
                    published_at: "desc"
                }
            })
            const bigPost = await prisma.posts.findFirst({
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
                    post_tags: {
                        some: {
                            tag: {
                                latin_title: "bodu"
                            }
                        }
                    },
                    published_at: {
                        lte: new Date()
                    },
                    NOT: {
                        id: breakingPost?.id
                    }
                },
                orderBy: {
                    published_at: "desc"
                }
            })
            const smallPost = await prisma.posts.findMany({
                select: {
                    id: true,
                    title: true,
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
                    post_tags: {
                        some: {
                            tag: {
                                latin_title: "kuda"
                            }
                        }
                    },
                    published_at: {
                        lte: new Date()
                    },
                    NOT: {
                        id: breakingPost?.id
                    }
                },
                orderBy: {
                    published_at: "desc"
                },
                take: 4
            })
            const postsByCategory = await prisma.categories.findMany({
                select: {
                    title: true,
                    latin_title: true,
                    posts: {
                        select: {
                            id: true,
                            title: true,
                            feature_image: {
                                select: {
                                    url: true,
                                    base64: true
                                }
                            },
                            published_at: true
                        },
                        where: {
                            published_at: {
                                lte: new Date()
                            },
                            AND: [
                                ...smallPost?.map((post)=>{
                                    return {
                                        id: {
                                            not: post?.id
                                        }
                                    }
                                }),
                                {
                                    id: {
                                        not: bigPost?.id
                                    }
                                }, 
                                {
                                    id: {
                                        not: breakingPost?.id
                                    }
                                }
                            ]
                        },
                        orderBy: {
                            published_at: "desc"
                        },
                        take: 9
                    }
                },
                where: {
                    published_at: {
                        not: null
                    }
                }
            })

            return res.status(200).json({
                bigPost: bigPost ? {
                    ...bigPost, 
                    id: hashids.encode(parseInt(String(bigPost?.id))), 
                    published_at: dayjs(bigPost?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")
                } : null,
                smallPost: smallPost?.map((post)=>(post ? {
                    ...post,
                    id: hashids.encode(parseInt(String(post?.id))), 
                    published_at: dayjs(post?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")
                } : null)),
                postsByCategory: postsByCategory?.map((category)=>(category ? {
                    ...category,
                    posts: category.posts?.map((post)=>(post ? {
                        ...post,
                        id: hashids.encode(parseInt(String(post?.id))), 
                        published_at: dayjs(post?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")
                    } : null))
                } : null)),
                breakingPost: breakingPost ? {
                    ...breakingPost, 
                    id: hashids.encode(parseInt(String(breakingPost?.id))), 
                    published_at: dayjs(breakingPost?.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")
                } : null
            })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}