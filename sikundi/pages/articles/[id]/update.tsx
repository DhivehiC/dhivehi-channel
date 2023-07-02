import Container from '@sikundi/components/Container'
import ArticleForm from '@sikundi/components/forms/ArticleForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'
import { prisma } from '@sikundi/libs/server/prisma'
import Hashids from 'hashids'

interface Props {
    article:any
    categories:any
    authors:any 
    preview_url:any
    revalidation_token:any
    revalidation_url:any
    perma_url:any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <ArticleForm type='update' categories={props.categories} data={props.article} perma_url={props.perma_url} preview_url={props.preview_url} authors={props.authors} revalidation={{
                    url: props.revalidation_url,
                    secret: props.revalidation_token
                }} />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Update a Article | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const hashids = new Hashids()
    let article
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        article = await prisma.posts.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                title: true,
                latin_title: true,
                long_title: true,
                description: true,
                yt_url: true,
                content: true,
                published_at: true,
                deleted_at: true,
                breaking: true,
                live_blog: true,
                feature_image: {
                    select: {
                        url: true
                    }
                },
                feature_image_caption: true,
                category: {
                    select: {
                        title: true
                    }
                },
                post_tags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                },
                created_by: {
                    select: {
                        email: true,
                        user_name: true
                    }
                },
                updated_by: true
            }
        })
    }
    if (article) {
        const categories = await prisma.categories.findMany({
            select: {
                id: true,
                title: true
            }
        })
        const authors = await prisma.users.findMany({
            select: {
                email: true,
                user_name: true
            }
        })
        return {
            props: {
                article: JSON.parse(JSON.stringify(article)),
                categories: JSON.parse(JSON.stringify(categories)),
                authors: JSON.parse(JSON.stringify(authors)),
                preview_url: process.env.PREVIEW_LINK,
                revalidation_token: process.env.REVALIDATION_TOKEN,
                revalidation_url: process.env.REVALIDATION_URL,
                perma_url: article.id ? `${process.env.FRONTEND_URL}/${hashids.encode(article.id)}` : undefined
            }
        }
    } else {
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        }
    }
}

export default Page