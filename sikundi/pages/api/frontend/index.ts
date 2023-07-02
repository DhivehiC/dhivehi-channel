import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
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
            const latestPhotos = await prisma.photos.findMany({
                select: {
                    id: true,
                    title: true,
                    feature_image: {
                        select: {
                            url: true
                        }
                    },
                    published_at: true
                },
                where: {
                    published_at: {
                        lte: new Date()
                    }
                },
            })
            const latestVideos = await prisma.videos.findMany({
                select: {
                    id: true,
                    title: true,
                    yt_url: true,
                    published_at: true
                },
                where: {
                    published_at: {
                        lte: new Date()
                    }
                },
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
                                    url: true
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
                        take: 5
                    }
                }
            })

            return res.status(200).json({
                bigPost : bigPost,

                smallPost : smallPost,

                latestPhotos : latestPhotos,

                latestVideos : latestVideos,

                postsByCategory: postsByCategory,

                breakingPost: breakingPost
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}