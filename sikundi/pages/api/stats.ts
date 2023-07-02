import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "GET") {
        try {
            const token = req.cookies.token
            const secret = process.env.ACCESS_TOKEN_SECRET
            jwt.verify(String(token), String(secret), async (err:any, user:any)=>{
                if (err) {
                    res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    const [firstDateC, lastDateC] = getFirstAndLastDateOfCurrentMonth();
                    const [firstDateP, lastDateP] = getFirstAndLastDateOfPreviousMonth();
                    
                    let cStats = await prisma.posts.groupBy({
                        by: ['category_id'],
                        _count: {
                            id: true
                        },
                        where: {
                            published_at: {
                                gte: firstDateC.toISOString(),
                                lte: lastDateC.toISOString()
                            }
                        },
                        orderBy: {
                            _count: {
                                id: 'desc'
                            }
                        },
                        take: 4
                    })
                    await Promise.all(cStats.map(async (stat)=>{
                        // @ts-ignore
                        stat.category = await prisma.categories.findUnique({
                            where: {id: stat.category_id},
                            select: {
                                title: true
                            }
                        })
                    }))

                    let pStats = await prisma.posts.groupBy({
                        by: ['category_id'],
                        _count: {
                            id: true
                        },
                        where: {
                            published_at: {
                                gte: firstDateP.toISOString(),
                                lte: lastDateP.toISOString()
                            }
                        },
                        orderBy: {
                            _count: {
                                id: 'desc'
                            }
                        },
                        take: 4
                    })
                    await Promise.all(pStats.map(async (stat)=>{
                        // @ts-ignore
                        stat.category = await prisma.categories.findUnique({
                            where: {id: stat.category_id},
                            select: {
                                title: true
                            }
                        })
                    }))

                    

                    return res.status(200).json({cStats, pStats})
                }
            })
        } catch (error) {
            res.status(500).json({ error })
        }
    } else {
        res.status(401).json({ error: `${req.method} is not allowed in this route.` })
    }
}

function getFirstAndLastDateOfCurrentMonth() {
    const currentDate = new Date();
    currentDate.setDate(1);
  
    const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    return [firstDayOfCurrentMonth, lastDayOfCurrentMonth];
}

function getFirstAndLastDateOfPreviousMonth() {
    const currentDate = new Date();
    currentDate.setDate(1);

    const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    return [firstDayOfPreviousMonth, lastDayOfPreviousMonth];
}