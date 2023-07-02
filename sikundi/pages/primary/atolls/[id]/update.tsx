import Container from '@sikundi/components/Container'
import AtollForm from '@sikundi/components/forms/AtollForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    atoll:any 
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <AtollForm type='update' data={props.atoll} />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Update a atoll | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let atoll
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        atoll = await prisma.atolls.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                name: true,
                created_at: true,
            }
        })
    }
    if (atoll) {
        return {
            props: {
                atoll: JSON.parse(JSON.stringify(atoll))
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