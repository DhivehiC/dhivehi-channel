import { GetServerSideProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { Fragment, useState } from 'react'
import Hashids from 'hashids'
import axios from 'axios'
import Image from 'next/image'
import { extractVideoId } from '@DhivehiChannel/libs/youtube'
import RichText from '@DhivehiChannel/components/blocks/RichText'
import AdCard from '@DhivehiChannel/components/cards/AdCard'
import CommentForm from '@DhivehiChannel/components/forms/CommentForm'
import CommentGroup from '@DhivehiChannel/components/blocks/CommentGroup'
import SocialShare from '@DhivehiChannel/components/other/SocialShare'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/dv'

const Index:NextPage<Props> = (props) => {
    dayjs.extend(relativeTime)
    const [sentComments, setSentComments] = useState<
        {
            id: Number
            created_by: String
            content: String
            notApproved: Boolean
        }[]
    >([])

    return (
        <Fragment>
            <NextSeo title={`${props.article.latin_title} | Dhivehi Channel`} description={props.article.description} openGraph={{
                url: `/${props.article.id}`,
                title: `${props.article.title} | Dhivehi Channel`,
                description: props.article.description,
                siteName: "Dhivehi Channel",
                images: [
                    { 
                        url:  `${
                            process.env.NEXT_PUBLIC_CLOUD_URL
                        }/api?image=${props.article?.feature_image?.url
                            ?.replace(
                                "https://cdn.dhivehichannel.mv/media/",
                                ""
                            )
                            ?.replace(".jpg", "")}` 
                    }
                ]
            }} twitter={{ cardType: "summary_large_image" }} />
            <div className='container p-4 mx-auto'>
                <h1 className='text-3xl font-black mb-8 text-gray-600 leading-normal'>{props.article.long_title}</h1>
                <div className='flex items-center gap-3 mb-4'>
                    <div className='h-10 w-10 rounded-full bg-gray-300'>

                    </div>
                    <h6 className='text-base font-normal mb-0 text-gray-400 leading-normal'>{props.article.created_by.user_name}</h6>
                </div>
                <h6 className='text-base font-normal mb-8 text-gray-400 leading-normal'>{dayjs(props.article.published_at).locale('dv').fromNow().split(" ").reverse().join(" ")}</h6>
                {
                    props?.article?.feature_image?.url ?
                    <div className='relative aspect-video w-full overflow-hidden rounded-lg mb-1'>
                        <Image src={props.article.feature_image.url} alt={props.article.long_title} fill className='object-cover' />
                    </div> :
                    <iframe src={`https://www.youtube.com/embed/${extractVideoId(String(props.article.yt_url))}?modestbranding=1`} className='aspect-video mb-1 w-full rounded-lg bg-gray-400' frameBorder="0" allowFullScreen />
                }
                <p className='mb-8 text-gray-400 text-base'>{props?.article?.feature_image_caption}</p>
                
                <SocialShare className='lg:mt-8 justify-center lg:justify-start mb-8 lg:mb-14' href={`${process.env.NEXT_PUBLIC_ASLU_URL}/${props?.article?.id}`} hashTag='#aslu-share'>{`${props.article?.latin_title}`}</SocialShare>
                <div className='grid grid-cols-12 mb-6'>
                    <div className="lg:col-span-8 col-span-12 mb-4">
                        <RichText className='w-full mb-8'>
                            {props.article?.content?.replace(
                                /&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g,
                                " "
                                )}
                        </RichText>
                        <CommentForm
                            className='mb-8 max-w-xl'
                            apiKey={String(process.env.NEXT_PUBLIC_TOKEN)}
                            apiUrl={`/api/comment/${props.article.id}`}
                            OnSucess={(res:any)=>{
                                setSentComments((data) => [
                                    ...data,
                                    {
                                        id: 0,
                                        created_by: `${res?.created_by}`,
                                        content: `${res?.content}`,
                                        notApproved: true,
                                    },
                                ])
                            }}
                        />
                        <CommentGroup
                            className="max-w-xl"
                            comments={[...props.article.comments, ...sentComments]}
                        />
                    </div>
                    <div className='lg:col-span-4 col-span-12'>
                        <AdCard className='' />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Index

export const getServerSideProps:GetServerSideProps<Props> = async (ctx) => {
    const hashids = new Hashids()
    const post:Props = (await axios.get(`${process.env.BACKEND_URL}/${hashids.decode(String(ctx?.query?.post_id))}`, {
        method: "get",
        headers: {
            authorization: `Bearer ${process.env.FRONTEND_TOKEN}`
        }
    })).data
    

    return { 
        props: { ...post, article: {...post.article, id: hashids.encode(post.article.id)} }
    }
}


interface Props {
    article: {
        id: string
        title: string
        latin_title: string
        long_title: string
        description: string
        yt_url: string
        created_by: {
            user_name: string
        }
        feature_image: {
            url: string
        }
        feature_image_caption: string
        content: string
        post_tags: {
            tag: {
                title: string
            }
        }[]
        category: {
            title: string
            latin_title: string
        }
        comments: {
            id: number
            created_by: string
            content: string
        }[]
        breaking: boolean
        published_at: string
    },
    relatedArticles: {
        id: number
        title: string
        published_at: string
        feature_image: {
            url: string
        }
    }[]
}