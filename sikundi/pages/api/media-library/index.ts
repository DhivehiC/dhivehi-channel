import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'
import axios from 'axios'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        try {
            const token = req.cookies.token
            const secret = process.env.ACCESS_TOKEN_SECRET
            jwt.verify(String(token), String(secret), async (err:any, user:any)=>{
                if (err) {
                    res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    try {
                        const media = await create({
                            caption: req.body.caption,
                            tags: req.body.tags,
                            url: req.body.url,
                            created_by: user.email
                        })
                        res.status(200).json({ media, notification: { title: "Media Created", content: `media been successfully added`, type: "success" } })
                    } catch (error) {
                        res.status(500).json({ error })
                    }
                }
            })
        } catch (error) {
            res.status(500).json({ error })
        }
    } else if (req.method === "GET") {
        try {
            const token = req.cookies.token
            const secret = process.env.ACCESS_TOKEN_SECRET
            const search:any = req.query.search
            const current = req.query.page || 0
            const per_page = 20
            jwt.verify(String(token), String(secret), async (err:any, user:any)=>{
                if (err) {
                    res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    try {
                        const media = await prisma.mediaLibrary.findMany({
                            select: {
                                id: true,
                                url: true,
                                caption: true
                            },
                            where: search ? {
                                OR: [
                                    {
                                        tags: {
                                            contains: search,
                                            mode: 'insensitive'
                                        }
                                    },
                                    {
                                        caption: {
                                            contains: search,
                                            mode: 'insensitive'
                                        }
                                    }
                                ]
                            } : undefined,
                            orderBy: {
                                created_at: 'desc'
                            },
                            take: per_page,
                            skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
                        })
                        const totalMedias = await prisma.mediaLibrary.aggregate({
                            _count: true,
                            where: search ? {
                                OR: [
                                    {
                                        tags: {
                                            contains: search,
                                            mode: 'insensitive'
                                        }
                                    },
                                    {
                                        caption: {
                                            contains: search,
                                            mode: 'insensitive'
                                        }
                                    }
                                ]
                            } : undefined,
                        })
                        res.status(200).json({ 
                            media: media,
                            totalPages: (Number(totalMedias._count)/per_page).toFixed(),
                            current: current === 0 ? 1 : current
                        })
                    } catch (error) {
                        res.status(500).json({ error })
                    }
                }
            })
        } catch (error) {
            res.status(500).json({ error })
        }
    } else {
        res.status(401).json({ error: `${req.method} is not allowed in this route.` })
    }
}

interface inputsSchema {
    caption?:string
    tags?:string
    url:string
    created_by?:string
}

async function create(inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.url) {
                validationErrors.url = ['url is required']
            }
            if (!inputs.created_by) {
                validationErrors.created_by = ['created_by is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                let returnedB64 = ""
                try {
                    let image = await axios.get(inputs.url.replace("/public", "/anim=false,compression=fast,sharpen=0,width=100,quality=0,blur=100"), {responseType: 'arraybuffer'});
                    returnedB64 = Buffer.from(image.data).toString('base64');
                } catch (error) {
                    
                }
                const media = await prisma.mediaLibrary.create({
                    select: {
                        id: true,
                        url: true,
                        caption: true
                    },
                    data: {
                        caption: inputs.caption,
                        tags: inputs.tags,
                        url: inputs.url,
                        base64: returnedB64,
                        created_by: {
                            connect: {
                                email: inputs.created_by
                            }
                        }
                    }
                })
                resolve(media)
            }
        } catch (error:any) {
            if (error.code === "P2002") {
                let validationErrors:any = {}
                error?.meta?.target?.map((field:any)=>{
                    validationErrors[field] = [`${field} must be unique`]
                })
                reject({ validationErrors })
            } else {
                reject(error)
            }
        }
    })
}