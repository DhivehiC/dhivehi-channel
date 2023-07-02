import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import initMB from 'messagebird';

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const messagebird = initMB(String(process.env.MESSAGE_BIRD));
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            if (req.method === "POST") {
                const phone = req.body.phone
                const otp = req.body.otp
                const requests = await prisma.poll.findUnique({
                    where: {
                        phone: parseInt(phone)
                    }
                })
                if (requests && requests?.otp === parseInt(otp)) {
                    await prisma.poll.update({
                        data: {
                            verified_at: new Date().toISOString()
                        },
                        where: {
                            phone: parseInt(phone)
                        }
                    })
                    return res.status(401).json({
                        message: "successfully verified",
                        otp: otp
                    })
                } else {
                    return res.status(401).json({
                        message: "not verified"
                    })
                }
            } 
            return res.status(401).json({
                message: "method not allowed"
            })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}