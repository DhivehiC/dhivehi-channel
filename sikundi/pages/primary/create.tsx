import Container from '@sikundi/components/Container'
import BoxForm from '@sikundi/components/forms/BoxForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    islands: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <BoxForm type='create' islands={props?.islands} />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Create a Vote Box | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const islands = await prisma.islands.findMany({
        select: {
            name: true,
            id: true
        }
    })
    return {
        props: {
            islands: islands
        }
    }
}

export default Page