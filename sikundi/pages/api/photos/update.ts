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
                    return res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    if (req.body.status === "forceDelete") {
                        const photo = await prisma.photos.delete({
                            select: {
                                id: true,
                                title: true,
                            },
                            where: {
                                id: req.body.id
                            }
                        })

                        let revalidation
                        if (process.env.NODE_ENV === "production") {
                            const revalidationRequest = await fetch(`${process.env.REVALIDATION_URL}?secret=${process.env.REVALIDATION_TOKEN}`, {
                                method: "POST",
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    paths: [
                                        '/',
                                        `/photos/${photo.id}`,
                                        `/photos/`
                                    ]
                                })
                            })
                            revalidation = await revalidationRequest.json()
                        }

                        return res.status(200).json({ 
                            revalidation,
                            photo,
                            forceDelete: true, 
                            notification: { 
                                title: `Photo Deleted`, 
                                content: `${photo.title} has been successfully Deleted in the cms`,
                                type: "failed"
                            }
                        })
                    } else {
                        try {
                            const photo:any = await update(req.body.id, {
                                title:req.body.title,
                                latin_title:req.body.latin_title,
                                long_title:req.body.long_title,
                                content:req.body.content,
                                feature_image : req.body.feature_image,
                                feature_image_caption : req.body.feature_image_caption,
                                email: req.body?.author || user.email,
                                published_at: req.body.status === "published" ? (req.body?.published_at ? new Date(req.body?.published_at) : new Date()) : null,
                                deleted_at: req.body.status === "deleted" ? new Date() : null,
                            })
                            let revalidation
                            
                            if (process.env.NODE_ENV === "production") {
                                const revalidationRequest = await fetch(`${process.env.REVALIDATION_URL}?secret=${process.env.REVALIDATION_TOKEN}`, {
                                    method: "POST",
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        paths: [
                                            '/',
                                            `/photos/${photo.id}`,
                                            `/photos/`
                                        ]
                                    })
                                })
                                revalidation = await revalidationRequest.json()
                            }

                            return res.status(200).json({ 
                                revalidation,
                                photo, 
                                notification: { 
                                    title: `Photo ${req.body.status === "deleted" ? "trashed" : req.body.status || "created"}`, 
                                    content: `${photo.title} has been successfully ${req.body.status === "deleted" ? "trashed" : req.body.status} from the cms`,
                                    type: req.body.status === "published" ? "success" : req.body.status === "deleted" ? "failed" : ""
                                }
                            })
                        } catch (error) {
                            return res.status(500).json({ error })
                        }
                    }
                }
            })
        } catch (error) {
            return res.status(500).json({ error })
        }
    } else {
        return res.status(401).json({ error: `${req.method} is not allowed in this route.` })
    }
}

interface inputsSchema {
    title:string
    latin_title:string
    long_title:string
    content:string
    email:string
    feature_image?: string
    feature_image_caption?: string
    deleted_at?: Date | null
    published_at?: Date | null
}
async function update(id: number, inputs:inputsSchema) {
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
                validationErrors.long_title = ['long_title is required']
            }
            if (!inputs.content) {
                validationErrors.content = ['content is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const photo = await prisma.photos.update({
                    data: {
                        title: inputs.title,
                        latin_title: inputs.latin_title,
                        long_title: inputs.long_title,
                        content: inputs.content,
                        published_at: inputs?.published_at,
                        deleted_at: inputs?.deleted_at,
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
                        },
                    },
                    where: {
                        id: id,
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