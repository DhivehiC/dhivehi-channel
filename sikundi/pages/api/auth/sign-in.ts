import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        try {
            const user:any = await signUp({
                email: req.body.email,
                password: req.body.password
            })
            res.setHeader(
                "Set-cookie",
                cookie.serialize("token", user.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: "strict",
                    path: "/"
                })
            )
            res.status(201).json({ user })
        } catch (error) {
            res.status(500).json({ error })
        }
    } else {
        res.status(401).json({ error: `${req.method} is not allowed in this route.` })
    }
}

interface inputsSchema {
    email: string
    password: string
}
async function signUp(inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.email) {
                validationErrors.email = ['email is required']
            }
            if (!inputs.password) {
                validationErrors.password = ['password is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const user = await prisma.users.findUnique({
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        user_name: true,
                        email: true,
                        password: true,
                        role: true,
                        status: true
                    },
                    where: {
                        email: inputs.email
                    }
                })
                if (user?.status === "active") {
                    if (await bcrypt.compare(inputs.password, user.password)) {
                        const token = jwt.sign({ ...user, password:undefined }, String(process.env.ACCESS_TOKEN_SECRET))
                        resolve({
                            token,
                            user: { ...user, password: undefined }
                        })
                    } else {
                        reject({ validationErrors: { password: "The password you entered is wrong" } })
                    }
                } else {
                    reject({ validationErrors: { email: "there is no user registered with this email." } })
                }
            }
        } catch (error:any) {
            reject(error)
        }
    })
}