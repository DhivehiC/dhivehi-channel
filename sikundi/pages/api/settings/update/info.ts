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
                if (err || (user.id !== req.body.id)) {
                    return res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    try {
                        const user:any = await update(req.body.id, {
                            firstName: req.body.first_name,
                            lastName: req.body.last_name,
                            userName: req.body.user_name,
                            email: req.body.email
                        })
                        
                        return res.status(200).json({ 
                            user, 
                            notification: { 
                                title: `Information updated`, 
                                content: `${user.email} has been successfully updated their Information from the cms`,
                                type: "success"
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
    firstName:string
    lastName:string
    userName:string
    email:string
}
async function update(id: number, inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.firstName) {
                validationErrors.firstName = ['firstName is required']
            }
            if (!inputs.lastName) {
                validationErrors.lastName = ['lastName is required']
            }
            if (!inputs.userName) {
                validationErrors.userName = ['userName is required']
            }
            if (!inputs.email) {
                validationErrors.email = ['email is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const user = await prisma.users.update({
                    data: {
                        first_name: inputs.firstName,
                        last_name: inputs.lastName,
                        user_name: inputs.userName,
                        email: inputs.email,
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
                resolve(user)
            }
        } catch (error:any) {
            console.log(error)
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