import Container from '@sikundi/components/Container'
import PhotoForm from '@sikundi/components/forms/PhotoForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    photos:any
    authors:any 
    preview_url:any
    revalidation_token:any
    revalidation_url:any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <PhotoForm type='update' data={props.photos} preview_url={props.preview_url} authors={props.authors} revalidation={{
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
                <title>Update a Photo | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let photos
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        photos = await prisma.photos.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                title: true,
                latin_title: true,
                long_title: true,
                content: true,
                published_at: true,
                deleted_at: true,
                feature_image: {
                    select: {
                        url: true
                    }
                },
                feature_image_caption: true,
                created_by: {
                    select: {
                        email: true,
                        user_name: true
                    }
                }
            }
        })
    }
    if (photos) {
        const authors = await prisma.users.findMany({
            select: {
                email: true,
                user_name: true
            }
        })
        return {
            props: {
                photos: JSON.parse(JSON.stringify(photos)),
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