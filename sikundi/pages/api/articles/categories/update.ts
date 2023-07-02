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
                        const category:any = await update(req.body.id, {
                            title: req.body.title,
                            latin_title: req.body.latin_title,
                            email: user.email,
                            published_at: req.body.status === "published" ? (req.body?.published_at ? new Date(req.body?.published_at) : new Date()) : null,
                            deleted_at: req.body.status === "deleted" ? new Date() : null,
                        })
                        let revalidation
                        
                        const revalidationRequest = await fetch(`${process.env.REVALIDATION_URL}?secret=${process.env.REVALIDATION_TOKEN}`, {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                paths: [
                                    `/category/${category.latin_title}`,
                                ]
                            })
                        })
                        revalidation = await revalidationRequest.json()

                        res.status(200).json({ 
                            revalidation,
                            category, 
                            notification: { 
                                title: `Tag ${req.body.status || "created"}`, 
                                content: `${category.title} has been successfully drafted in the cms`,
                                type: req.body.status === "published" ? "success" : req.body.status === "deleted" ? "failed" : ""
                            }
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
    title: string
    latin_title: string
    email: string
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
            if (!inputs.email) {
                validationErrors.email = ['email is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const category = await prisma.categories.update({
                    data: {
                        title: inputs?.title,
                        latin_title: inputs?.latin_title,
                        published_at: inputs?.published_at,
                        deleted_at: inputs?.deleted_at,
                        created_by: {
                            connect: {
                                email: inputs?.email
                            }
                        }
                    },
                    select: {
                        title: true,
                        latin_title: true,
                        created_by: {
                            select: {
                                email: true
                            }
                        }
                    },
                    where: {
                        id: id,
                    }
                })
                resolve(category)
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