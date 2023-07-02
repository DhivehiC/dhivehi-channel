import Container from '@sikundi/components/Container'
import ArticleForm from '@sikundi/components/forms/ArticleForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'
import { prisma } from '@sikundi/libs/server/prisma'
import Heading from '@sikundi/components/Heading'
import Button from '@sikundi/components/Button'

interface Props {
    comments: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <div className='flex justify-between flex-wrap gap-3 my-5'>
                    <Heading level={30} className="text-accent">Comments</Heading>
                    <Button className='bg-success'>Revalidate</Button>
                </div>
                <div>
                    {
                        props.comments?.map((comment:any, index:number)=>(
                            <div className='w-full py-3 px-4 bg-secondary rounded-md mb-3' dir='rtl' key={index}>
                                <Heading level={24} className="text-primary mb-3">{comment.created_by}</Heading>
                                <Heading level={16} className="text-accent">{comment.content}</Heading>
                            </div>
                        ))
                    }
                </div>
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Comments | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        const article = await prisma.posts.findUnique({
            select: {
                id: true,
                comments: {
                    select: {
                        content: true,
                        created_by: true,
                        published_at: true,
                    }
                }
            },
            where: {
                id: parseInt(id)
            }
        })
        if (article?.id) {
            return {
                props: {
                    comments: article.comments
                }
            }
        }
    }

    return {
        redirect: {
            destination: "/404",
            permanent: false
        }
    }
}

export default Page