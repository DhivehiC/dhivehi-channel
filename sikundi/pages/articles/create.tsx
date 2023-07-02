import Container from '@sikundi/components/Container'
import ArticleForm from '@sikundi/components/forms/ArticleForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    categories: any
    authors: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container className='py-5'>
                <ArticleForm type='create' categories={props?.categories} authors={props?.authors} />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Create a article | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
            categories: categories,
            authors: authors
        }
    }
}

export default Page