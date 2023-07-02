import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import bcrypt from 'bcrypt'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        try {
            const user = await signUp({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                user_name: req.body.user_name,
                email: req.body.email,
                password: req.body.password
            })
            res.status(201).json({ user })
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
    password: string
}
async function signUp(inputs:inputsSchema) {
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
            if (!inputs.password) {
                validationErrors.password = ['password is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const password = await bcrypt.hash(inputs.password, 10)
                const user = await prisma.users.create({
                    data: {
                        first_name: inputs.first_name,
                        last_name: inputs.last_name,
                        user_name: inputs.user_name,
                        email: inputs.email,
                        password: password,
                    },
                    select: {
                        id: true,
                        email: true
                    }
                })
                resolve(user)
            }
        } catch (error:any) {
            if (error.code === "P2002") {
                let validationErrors:any = {}
                error?.meta?.target?.map((field:any)=>{
                    validationErrors[field] = [`there is already a user registered with this ${field}.`]
                })
                reject({ validationErrors })
            } else {
                reject(error)
            }
        }
    })
}