import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const mainPost = await prisma.posts.findMany({
                select: {
                    id: true,
                    title: true,
                    category: {
                        select: {
                            title: true,
                            latin_title: true
                        }
                    },
                    yt_url: true,
                    feature_image: {
                        select: {
                            url: true
                        }
                    },
                    _count: {
                        select: {
                            comments: {
                                where: {
                                    published_at: {
                                        not: null
                                    }
                                }
                            }
                        }
                    },
                    published_at: true
                },
                orderBy: {
                    published_at: "desc"
                },
                take: 1,
                where: {
                    post_tags: {
                        some: {
                            tag: {
                                latin_title: "main"
                            }
                        }
                    },
                    published_at: {
                        lte: new Date()
                    },
                }
            })
            const bigPost = await prisma.posts.findMany({
                select: {
                    id: true,
                    title: true,
                    category: {
                        select: {
                            title: true,
                            latin_title: true
                        }
                    },
                    yt_url: true,
                    feature_image: {
                        select: {
                            url: true
                        }
                    },
                    _count: {
                        select: {
                            comments: {
                                where: {
                                    published_at: {
                                        not: null
                                    }
                                }
                            }
                        }
                    },
                    published_at: true
                },
                orderBy: {
                    published_at: "desc"
                },
                take: 3,
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
                }
            })
            const smallPost = await prisma.posts.findMany({
                select: {
                    id: true,
                    title: true,
                    category: {
                        select: {
                            title: true,
                            latin_title: true
                        }
                    },
                    yt_url: true,
                    published_at: true,
                    feature_image: {
                        select: {
                            url: true
                        }
                    }
                },
                orderBy: {
                    published_at: "desc"
                },
                take: 5,
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
                }
            })
            res.status(200).json({ bigPost, smallPost, mainPost })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}
