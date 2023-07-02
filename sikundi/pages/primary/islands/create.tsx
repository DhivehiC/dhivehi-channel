import Container from '@sikundi/components/Container'
import IslandForm from '@sikundi/components/forms/IslandForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    atolls: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <IslandForm type='create' atolls={props?.atolls} />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Create a Island | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const atolls = await prisma.atolls.findMany({
        select: {
            name: true,
            id: true
        }
    })
    return {
        props: {
            atolls: atolls
        }
    }
}

export default Page