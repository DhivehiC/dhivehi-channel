import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        try {
            const token = req.cookies.token
            const secret = process.env.ACCESS_TOKEN_SECRET
            jwt.verify(String(token), String(secret), async (err:any, user:any)=>{
                if (err || (user.id !== req.body.id)) {
                    return res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    try {
                        const user:any = await update(req.body.id, {
                            currentPassword: req.body.current_password,
                            newPassword: req.body.new_password,
                            confirmPassword: req.body.confirm_password
                        })
                        
                        return res.status(200).json({ 
                            user, 
                            notification: { 
                                title: `password updated`, 
                                content: `${user.email} has been successfully updated their password from the cms`,
                                type: "success"
                            }
                        })
                    } catch (error) {
                        console.log(error)
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
    currentPassword:string
    newPassword:string
    confirmPassword:string
}
async function update(id: number, inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.currentPassword) {
                validationErrors.currentPassword = ['currentPassword is required']
            }
            if (!inputs.newPassword) {
                validationErrors.newPassword = ['newPassword is required']
            }
            if (!inputs.newPassword) {
                validationErrors.confirmPassword = ['confirmPassword is required']
            }
            if (inputs.confirmPassword !== inputs.newPassword) {
                validationErrors.confirmPassword = [`new password and confirm password don't match`]
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const user = await prisma.users.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        id: true,
                        password: true
                    }
                })
                const validPassword = await bcrypt.compare(inputs.currentPassword, String(user?.password))
                if (!validPassword) {
                    validationErrors.currentPassword = [`current password doesn't match`]
                    reject({ validationErrors })
                } else {
                    const password = await bcrypt.hash(`${inputs.newPassword}`, 10)
                    const updatedUser = await prisma.users.update({
                        data: {
                            password: password
                        },
                        where: {
                            id: id
                        },
                        select: {
                            email: true,
                            id: true,
                            password: true
                        }
                    })
                    resolve(updatedUser)
                }
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