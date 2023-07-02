import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'

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
                        const photo:any = await create({
                            title:req.body.title,
                            latin_title:req.body.latin_title,
                            long_title:req.body.long_title,
                            content:req.body.content,
                            email:user.email,
                            feature_image : req.body.feature_image,
                            feature_image_caption : req.body.feature_image_caption,
                        })
                        res.status(200).json({ photo, notification: { title: "Photo Created", content: `${photo.title} has been successfully drafted in the cms`, type: "success" } })
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
    title:string
    latin_title:string
    long_title:string
    content:string
    feature_image?: string
    feature_image_caption?: string
    email:string
}
async function create(inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.title) {
                validationErrors.email = ['title is required']
            }
            if (!inputs.latin_title) {
                validationErrors.password = ['latin_title is required']
            }
            if (!inputs.long_title) {
                validationErrors.email = ['long_title is required']
            }
            if (!inputs.content) {
                validationErrors.content = ['content is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const photo = await prisma.photos.create({
                    data: {
                        title: inputs.title,
                        latin_title: inputs.latin_title,
                        long_title: inputs.long_title,
                        content: inputs.content,
                        feature_image: {
                            connect: inputs?.feature_image ? {
                                url: inputs?.feature_image
                            } : undefined
                        },
                        feature_image_caption: inputs?.feature_image_caption,
                        created_by: {
                            connect: {
                                email: inputs.email
                            }
                        }
                    },
                    select: {
                        id: true,
                        title: true,
                        latin_title: true,
                        created_by: {
                            select: {
                                email: true
                            }
                        }
                    }
                })
                resolve(photo)
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