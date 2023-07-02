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
                    try {
                        const user:any = await update(req.body.id, {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            user_name: req.body.user_name,
                            email: req.body.email,
                            role: req.body.role,
                            status: req.body.status,
                            password: req.body.password
                        })

                        return res.status(200).json({ 
                            user, 
                            notification: { 
                                title: `user ${req.body.status === "deleted" ? "trashed" : req.body.status || "created"}`, 
                                content: `${user.email} has been successfully updated from the cms`,
                                type: user.status === "active" ? "success" : user.status === "banned" ? "failed" : ""
                            }
                        })
                    } catch (error) {
                        return res.status(500).json({ error })
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
    first_name: string
    last_name: string
    user_name: string
    email: string
    role: "admins" | "writers" | "editors"
    status: "active" | "banned"
    password: string
}
async function update(id: number, inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.first_name) {
                validationErrors.first_name = ['first_name is required']
            }
            if (!inputs.last_name) {
                validationErrors.last_name = ['last_name is required']
            }
            if (!inputs.user_name) {
                validationErrors.user_name = ['user_name is required']
            }
            if (!inputs.email) {
                validationErrors.email = ['email is required']
            }
            if (!inputs.role) {
                validationErrors.role = ['role is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const user = await prisma.users.update({
                    data: {
                        first_name: inputs?.first_name,
                        last_name: inputs?.last_name,
                        user_name: inputs?.user_name,
                        email: inputs?.email,
                        status: inputs?.status,
                        role: inputs?.role,
                        password: inputs?.password
                    },
                    select: {
                        id: true,
                        email: true,
                        status: true
                    },
                    where: {
                        id: id,
                    }
                })
                resolve(user)
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