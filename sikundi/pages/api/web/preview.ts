import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            const token = req.query.token
            const id:any = req.query.id
            if (token===undefined && id===undefined) {
                return res.status(500).json({ article: null })
            } else {      
                const article = await prisma?.posts.findUnique({
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
                        breaking: true,
                    },
                    where: {
                        id: parseInt(id)
                    }
                })
                return res.status(200).json({ article })
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}