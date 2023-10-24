import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sikundi/libs/server/prisma'
import jwt from 'jsonwebtoken'
import { transliterate as tr, slugify } from 'transliteration'
import facebookPost from '@sikundi/libs/server/facebookPost'
import twitterPost from '@sikundi/libs/server/twitterPost'
import TelegramPost from '@sikundi/libs/server/TelegramPost'
import Hashids from 'hashids'
import schedule from 'node-schedule'
import axios from 'axios'

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const hashids = new Hashids()

    if (req.method === "POST") {
        try {
            const token = req.cookies.token
            const secret = process.env.ACCESS_TOKEN_SECRET
            jwt.verify(String(token), String(secret), async (err:any, user:any)=>{
                if (err) {
                    return res.status(401).json({ authorizationError: "you don't have authorization for this action" })
                } else {
                    if (req.body.status === "forceDelete") {
                        const article = await prisma.posts.delete({
                            select: {
                                id: true,
                                title: true,
                                category: {
                                    select: {
                                        latin_title: true
                                    }
                                }
                            },
                            where: {
                                id: req.body.id
                            }
                        })

                        let revalidation
                        try {
                            const revalidationRequest = await fetch(`${process.env.REVALIDATION_URL}?secret=${process.env.REVALIDATION_TOKEN}`, {
                                method: "POST",
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    paths: [
                                        '/',
                                        `/${hashids.encode(article.id)}`,
                                        `/category/${article.category.latin_title}`
                                    ]
                                })
                            })
                            revalidation = await revalidationRequest.json()
                        } catch (error) {
                            revalidation = { revalidated: false }    
                            console.log(error)          
                        }

                        return res.status(200).json({ 
                            revalidation,
                            article,
                            forceDelete: true, 
                            notification: { 
                                title: `Article Deleted`, 
                                content: `${article.title} has been successfully Deleted in the cms`,
                                type: "failed"
                            }
                        })
                    } else {
                        try {
                            const article:any = await update(req.body.id, {
                                title:req.body.title,
                                latin_title:req.body.latin_title,
                                long_title:req.body.long_title,
                                description:req.body.description,
                                yt_url:req.body.yt_url,
                                content:req.body.content,
                                category:req.body.category,
                                feature_image : req.body.feature_image,
                                feature_image_caption : req.body.feature_image_caption,
                                email: req.body?.author || user.email,
                                user_id: user.id,
                                tags: req.body.tags || [],
                                published_at: req.body.status === "published" ? (req.body?.published_at ? new Date(req.body?.published_at) : new Date()) : null,
                                deleted_at: req.body.status === "deleted" ? new Date() : null,
                                breaking: req.body?.breaking ? true : false,
                                live_blog: req.body?.live_blog ? true : false,
                                postToFacebook: req.body?.postToFacebook,
                                postToTwitter: req.body?.postToTwitter,
                                postToTelegram: req.body?.postToTelegram
                            })
                            let revalidation
                            if (new Date(req.body?.published_at) > new Date()) {
                                schedule.scheduleJob(new Date(req.body?.published_at), async function() {
                                    try {
                                        const revalidationRequest = await fetch(`${process.env.REVALIDATION_URL}?secret=${process.env.REVALIDATION_TOKEN}`, {
                                            method: "POST",
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                paths: [
                                                    '/',
                                                    `/${hashids.encode(article.id)}`,
                                                    `/category/${article.category.latin_title}`
                                                ]
                                            })
                                        })
                                        revalidation = await revalidationRequest.json()
                                        if (req.body?.postToTelegram && article?.published_at) {
                                            await TelegramPost(article.latin_title, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                        }
                                        if (req.body?.postToFacebook && article?.published_at) {
                                            await facebookPost(`${article.latin_title} %0A %0AFollow Us On Twitter: https://twitter.com/aslunewsmv`, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                        }
                                        if (req.body?.postToTwitter && article?.published_at) {
                                            await twitterPost(article.latin_title, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                        }
                                        // if (req.body?.postToTelegram && article?.published_at) {
                                        //     await TelegramPost(`${article.latin_title} %0A Join Our Telegram Channel: https://t.me/AsluMedia`, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                        // }
                                        // if (req.body?.postToFacebook && article?.published_at) {
                                        //     await facebookPost(article.latin_title, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                        // }
                                        // if (req.body?.postToTwitter && article?.published_at) {
                                        //     await twitterPost(article.latin_title, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                        // }
                                    } catch (error) {
                                        revalidation = { revalidated: false }                             
                                    }
                                })
                            } else {
                                try {
                                    const revalidationRequest = await fetch(`${process.env.REVALIDATION_URL}?secret=${process.env.REVALIDATION_TOKEN}`, {
                                        method: "POST",
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            paths: [
                                                '/',
                                                `/${hashids.encode(article.id)}`,
                                                `/category/${article.category.latin_title}`
                                            ]
                                        })
                                    })
                                    revalidation = await revalidationRequest.json()
                                    if (req.body?.postToTelegram && article?.published_at) {
                                        await TelegramPost(article.latin_title, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                    }
                                    if (req.body?.postToFacebook && article?.published_at) {
                                        const data = await facebookPost(`${article.latin_title}`, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                        console.log(data)
                                    }
                                    if (req.body?.postToTwitter && article?.published_at) {
                                        await twitterPost(article.latin_title, `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}`)
                                    }
                                } catch (error) {
                                    revalidation = { revalidated: false }                             
                                }
                            }
                            
                            return res.status(200).json({ 
                                revalidation,
                                article, 
                                notification: { 
                                    title: `Article ${req.body.status === "deleted" ? "trashed" : req.body.status || "created"}`, 
                                    content: `${article.title} has been successfully ${req.body.status === "deleted" ? "trashed" : req.body.status} from the cms`,
                                    type: req.body.status === "published" ? "success" : req.body.status === "deleted" ? "failed" : ""
                                }
                            })
                        } catch (error) {
                            return res.status(500).json({ error })
                        }
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
    title:string
    latin_title:string
    long_title:string
    description:string
    yt_url:string
    content:string
    category:string
    email:string
    feature_image?: string
    feature_image_caption?: string
    tags:string[]
    deleted_at?: Date | null
    published_at?: Date | null
    breaking?:boolean
    live_blog?:boolean
    user_id?: any
    postToFacebook?: boolean
    postToTwitter?: boolean
    postToTelegram?: boolean
}
async function update(id: number, inputs:inputsSchema) {
    const hashids = new Hashids()
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
                validationErrors.long_title = ['long_title is required']
            }
            if (!inputs.description) {
                validationErrors.description = ['description is required']
            }
            if (!inputs.content) {
                validationErrors.content = ['content is required']
            }
            if (!inputs.category) {
                validationErrors.category = ['category is required']
            }
            if (Object.keys(validationErrors).length) {
                reject({ validationErrors })
            } else {
                const post = await prisma.posts.update({
                    data: {
                        title: inputs.title,
                        latin_title: inputs.latin_title,
                        long_title: inputs.long_title,
                        description: inputs.description,
                        yt_url: inputs?.yt_url,
                        content: inputs.content,
                        published_at: inputs?.published_at,
                        deleted_at: inputs?.deleted_at,
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
                        },
                        category: {
                            select: {
                                latin_title: true
                            }
                        },
                        published_at: true,
                        feature_image: {
                            select: {
                                url: true
                            }
                        }
                    },
                    where: {
                        id: id,
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
                    data: uniqify(tags, 'tag_id')
                })

                resolve(post)
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

function createNewTags(newTags:any) {
    return new Promise(async (resolve, reject)=>{
        try {
            const temp = await newTags?.map(async (tag:any)=>{
                return await prisma.tags.create({
                    data: tag
                })
            })
            resolve(temp)
        } catch (error) {
            reject(error)
        }
    })
}

const uniqify = (array:any, key:any) => array.reduce((prev:any, curr:any) => prev.find((a:any) => a[key] === curr[key]) ? prev : prev.push(curr) && prev, []);