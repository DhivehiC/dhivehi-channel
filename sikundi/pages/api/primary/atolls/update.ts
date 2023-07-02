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
                        const atoll:any = await update(req.body.id, {
                            name: req.body.name,
                        })

                        res.status(200).json({ 
                            atoll, 
                            notification: { 
                                title: `atoll updated`, 
                                content: `${atoll.name} has been successfully drafted in the cms`,
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

interface inputsSchema {
    name: string
}
async function update(id: number, inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.name) {
                validationErrors.name = ['name is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const atoll = await prisma.atolls.update({
                    data: {
                        name: inputs?.name,
                    },
                    select: {
                        id: true,
                        name: true,
                        created_at: true,
                    },
                    where: {
                        id: id,
                    }
                })
                resolve(atoll)
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