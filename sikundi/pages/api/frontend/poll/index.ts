import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (token !== process.env.FRONTEND_TOKEN) {
            return res.status(401).json({ error: "unauthorized token" })
        } else {
            if (req.method === "POST") {
                const nasheed = req.body.nasheed
                const solih = req.body.solih
                const otp = req.body.otp
                const phone = req.body.phone

                const request = await prisma.poll.findFirst({
                    where: {
                        phone: parseInt(phone),
                        otp: parseInt(otp),
                        verified_at: {
                            not: null
                        },
                        solihVote: false,
                        nasheedVote: false
                    }
                })

                if (request) {
                    await prisma.poll.update({
                        data: {
                            nasheedVote: nasheed,
                            solihVote: solih
                        },
                        where: {
                            phone: parseInt(phone)
                        }
                    })
                    return res.status(200).json({
                        solih: await prisma.poll.count({
                            where: {
                                solihVote: true
                            }
                        }),
                        nasheed: await prisma.poll.count({
                            where: {
                                nasheedVote: true
                            }
                        })
                    })
                } else {
                    return res.status(500).json({
                        message: "params are missing"
                    })
                }
            } else if (req.method === "GET") {
                return res.status(200).json({
                    solih: await prisma.poll.count({
                        where: {
                            solihVote: true
                        }
                    }),
                    nasheed: await prisma.poll.count({
                        where: {
                            nasheedVote: true
                        }
                    })
                })
            }
            return res.status(401).json({
                message: "method not allowed"
            })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}