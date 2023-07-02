import Container from '@sikundi/components/Container'
import CategoryForm from '@sikundi/components/forms/CategoryForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    tag:any 
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <CategoryForm type='update' data={props.tag} />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Update a tag | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let tag
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        tag = await prisma.categories.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                title: true,
                latin_title: true,
                published_at: true
            }
        })
    }
    if (tag) {
        return {
            props: {
                tag: JSON.parse(JSON.stringify(tag))
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