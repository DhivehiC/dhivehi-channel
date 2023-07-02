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
                        const comment:any = await approve(req.body.id)

                        res.status(200).json({ 
                            comment, 
                            notification: { 
                                title: `Comment Approved`, 
                                content: `Comment has been successfully aprroved in the cms`,
                                type: "success"
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


async function approve(id: number) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!id) {
                validationErrors.id = ['id is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const comment = await prisma.comments.update({
                    data: {
                        published_at: new Date().toISOString(),
                    },
                    where: {
                        id: id,
                    }
                })
                resolve(comment)
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