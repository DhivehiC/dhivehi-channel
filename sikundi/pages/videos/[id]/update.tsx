import Container from '@sikundi/components/Container'
import VideoForm from '@sikundi/components/forms/VideoForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    videos:any
    authors:any 
    preview_url:any
    revalidation_token:any
    revalidation_url:any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <VideoForm type='update' data={props.videos} preview_url={props.preview_url} authors={props.authors} revalidation={{
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
                <title>Update a Video | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let videos
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        videos = await prisma.videos.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                title: true,
                latin_title: true,
                long_title: true,
                yt_url: true,
                content: true,
                published_at: true,
                deleted_at: true,
                created_by: {
                    select: {
                        email: true,
                        user_name: true
                    }
                }
            }
        })
    }
    if (videos) {
        const authors = await prisma.users.findMany({
            select: {
                email: true,
                user_name: true
            }
        })
        return {
            props: {
                videos: JSON.parse(JSON.stringify(videos)),
                authors: JSON.parse(JSON.stringify(authors)),
                preview_url: process.env.PREVIEW_LINK,
                revalidation_token: process.env.REVALIDATION_TOKEN,
                revalidation_url: process.env.REVALIDATION_URL
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