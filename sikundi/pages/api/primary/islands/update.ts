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
                        const island:any = await update(req.body.id, {
                            name: req.body.name,
                            atoll: req.body.atoll,
                        })
                        res.status(200).json({ 
                            island, 
                            notification: { 
                                title: `Island updated`, 
                                content: `${island.name} has been successfully updated in the cms`,
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
    atoll: string
}
async function update(id: number, inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.name) {
                validationErrors.name = ['name is required']
            }
            if (!inputs.atoll) {
                validationErrors.atoll = ['atoll is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const island = await prisma.islands.update({
                    data: {
                        name: inputs?.name,
                        atoll: {
                            connect: {
                                id: parseInt(inputs?.atoll)
                            }
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        atoll: {
                            select: {
                                name: true
                            }
                        }
                    },
                    where: {
                        id: id
                    }
                })
                resolve(island)
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