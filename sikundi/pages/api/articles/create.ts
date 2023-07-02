import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'
import { transliterate as tr, slugify } from 'transliteration'

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
                        const article:any = await create({
                            title:req.body.title,
                            latin_title:req.body.latin_title,
                            long_title:req.body.long_title,
                            description:req.body.description,
                            yt_url:req.body.yt_url,
                            content:req.body.content,
                            category:req.body.category,
                            feature_image : req.body.feature_image,
                            feature_image_caption : req.body.feature_image_caption,
                            email:user.email,
                            user_id:user.id,
                            tags: req.body.tags || [],
                            breaking: req.body?.breaking ? true : false,
                            live_blog: req.body?.live_blog ? true : false
                        })
                        res.status(200).json({ article, notification: { title: "Article Created", content: `${article.title} has been successfully drafted in the cms`, type: "success" } })
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
    title:string
    latin_title:string
    long_title:string
    description:string
    yt_url:string
    content:string
    category:string
    feature_image?: string
    feature_image_caption?: string
    tags:string[]
    email:string
    breaking?:boolean
    live_blog?:boolean
    user_id?: any
}
async function create(inputs:inputsSchema) {
    return new Promise(async (resolve, reject)=>{
        try {
            let validationErrors:any = {}
            if (!inputs.title) {
                validationErrors.email = ['title is required']
            }
            if (!inputs.latin_title) {
                validationErrors.password = ['latin_title is required']
            }
            if (!inputs.long_title) {
                validationErrors.email = ['long_title is required']
            }
            if (!inputs.description) {
                validationErrors.description = ['description is required']
            }
            if (!inputs.content) {
                validationErrors.content = ['content is required']
            }
            if (!inputs.category) {
                validationErrors.Category = ['Category is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const post = await prisma.posts.create({
                    data: {
                        title: inputs.title,
                        latin_title: inputs.latin_title,
                        long_title: inputs.long_title,
                        description: inputs.description,
                        yt_url: inputs?.yt_url,
                        content: inputs.content,
                        breaking: inputs.breaking,
                        live_blog: inputs.live_blog,
                        category: {
                            connect: {
                                title: inputs.category
                            }
                        },
                        feature_image: {
                            connect: inputs?.feature_image ? {
                                url: inputs?.feature_image
                            } : undefined
                        },
                        feature_image_caption: inputs?.feature_image_caption,
                        created_by: {
                            connect: {
                                email: inputs.email
                            }
                        }
                    },
                    select: {
                        id: true,
                        title: true,
                        latin_title: true,
                        created_by: {
                            select: {
                                email: true
                            }
                        }
                    }
                })
                await prisma.postsToTags.deleteMany({
                    where: {
                        post_id: post.id
                    }
                })

                let oldTags:any = []
                let newTags:any = []
                inputs?.tags.map((item:any)=>{
                    if (item?.__isNew__) {
                        newTags.push({ title: item?.label, latin_title: slugify(item?.label), created_by_user_id: parseInt(inputs.user_id) })
                    } else {
                        oldTags.push({ id: item?.value })
                    }
                })
                let newTagsFromDB:any = []
                try {
                    for (let i = 0; i < newTags.length; i++) {
                        const temp = await prisma.tags.upsert({
                            create: newTags[0],
                            update: newTags[0],
                            where: {
                                title: newTags[0].title
                            }
                        })
                        newTagsFromDB.push(temp)
                    }
                } catch (error) {

                }

                const tags = [ ...oldTags, ...newTagsFromDB ].map((item)=>{
                    return ({
                        post_id: item?.id && post.id,
                        tag_id: item?.id && parseInt(item?.id)
                    })
                })
                await prisma.postsToTags.createMany({
                    data: tags
                })
                resolve(post)
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