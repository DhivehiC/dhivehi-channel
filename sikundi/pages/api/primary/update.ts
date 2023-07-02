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
                    res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    try {
                        const voteBox:any = await update(req.body.id, {
                            box_number: req.body.box_number,
                            name: req.body.name,
                            island: req.body.island,
                            eligible: req.body.eligible,
                            no_show: req.body.no_show,
                            void: req.body.void,
                            ibu: req.body.ibu,
                            anni: req.body.anni
                        })
                        res.status(200).json({ 
                            voteBox, 
                            notification: { 
                                title: `Vote Box updated`, 
                                content: `${voteBox.name} has been successfully updated in the cms`,
                                type: "success"
                            }
                        })
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
    box_number: string
    name: string
    island: string
    eligible: string
    no_show: string
    void: string
    ibu: string
    anni: string
}
async function update(id: number, inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.box_number) {
                validationErrors.box_number = ['box_number is required']
            }
            if (!inputs.name) {
                validationErrors.name = ['name is required']
            }
            if (!inputs.island) {
                validationErrors.island = ['island is required']
            }
            if (parseInt(inputs.eligible) < (parseInt(inputs.ibu || "0")+parseInt(inputs.anni || "0")+parseInt(inputs.void || "0")+parseInt(inputs.no_show || "0")+parseInt(inputs.void || "0"))) {
                validationErrors.eligible = ['there is validation errors in calculations']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const voteBox = await prisma.voteBoxes.update({
                    data: {
                        box_number: inputs?.box_number,
                        name: inputs?.name,
                        island: {
                            connect: {
                                id: parseInt(inputs?.island)
                            }
                        },
                        eligible: parseInt(inputs?.eligible || "0"),
                        no_show: parseInt(inputs?.no_show || "0"),
                        void: parseInt(inputs?.void || "0"),
                        ibu: parseInt(inputs?.ibu || "0"),
                        anni: parseInt(inputs?.anni || "0"),
                        updated_at: new Date().toISOString()
                    },
                    select: {
                        id: true,
                        name: true
                    },
                    where: {
                        id: id
                    }
                })
                resolve(voteBox)
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