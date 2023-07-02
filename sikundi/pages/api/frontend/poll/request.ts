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
                const requests = await prisma.poll.findUnique({
                    where: {
                        phone: parseInt(phone)
                    }
                })
                const otp = Math.floor(100000 + Math.random() * 900000)
                if (requests && requests?.tries >= 5) {
                    return res.status(401).json({
                        message: "you have already tried to vote more than 5 times"
                    })
                } else if (requests && (requests?.solihVote || requests?.nasheedVote)) {
                    return res.status(401).json({
                        message: "you have already voted"
                    })
                } else {
                    messagebird.messages.create({
                        originator: "aslumedia",
                        recipients: [`960${phone}`],
                        body: `your verification code for perticipating in aslu poll is ${otp}.`
                    }, function (err, response) {
                        
                    })
                    if (!requests) {
                        await prisma.poll.create({
                            data: {
                                phone: parseInt(phone),
                                otp: otp
                            }
                        })
                    } else {
                        await prisma.poll.update({
                            data: {
                                otp: otp,
                                tries: requests.tries + 1
                            },
                            where: {
                                phone: parseInt(phone)
                            }
                        })
                    }

                    return res.status(200).json({
                        message: "otp successfully sent"
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