import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

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
                        const user:any = await create({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            user_name: req.body.user_name,
                            email: req.body.email,
                            role: req.body.role
                        })
                        res.status(200).json({ user, notification: { title: "User Created", content: `${user.email} has been successfully drafted in the cms`, type: "success" } })
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
    first_name: string
    last_name: string
    user_name: string
    email: string
    role: "admins" | "writers" | "editors"
}
async function create(inputs:inputsSchema) {
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
                const password = await bcrypt.hash(`${inputs.first_name}@aslu`, 10)
                const user = await prisma.users.create({
                    data: {
                        first_name: inputs.first_name,
                        last_name: inputs.last_name,
                        user_name: inputs.user_name,
                        email: inputs.email,
                        role: inputs.role,
                        password: password,
                    },
                    select: {
                        id: true,
                        email: true,
                        first_name: true
                    }
                })
                resolve(user)
                // const transporter = nodemailer.createTransport({
                //     service: 'hotmail',
                //     auth: {
                //         user: process.env.EMAIL_USER,
                //         pass: process.env.EMAIL_PASSWORD
                //     }
                // })
                // const options = {
                //     from: process.env.EMAIL_USER,
                //     to: user.email,
                //     subject: "providing password for sikundi cms",
                //     text: `you can use ${user.email} as a email and ${inputs.first_name}@aslu as a password to login sikundi cms of aslu media house.`,
                //     html: `
                //         <h3>Hello, ${user.first_name}.</h3>
                //         <p>This mail is intent to send to credentials for sikundi cms of aslu media house.</p>
                //         <h4>CREDENTIALS</h4>
                //         <p><b>Email:</b> ${user.email}</p>
                //         <p><b>Password:</b> ${inputs.first_name}@aslu</p>
                //     `,
                // }
                // transporter.sendMail(options, async function (error:any, info:any) {
                //     if (error) {
                //         await prisma.users.delete({
                //             where: {
                //                 id: user.id
                //             }
                //         })
                //         reject(error)
                //     } else {
                //         resolve(user)
                //     }
                // })
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