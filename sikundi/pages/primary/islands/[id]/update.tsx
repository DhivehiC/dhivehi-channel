import Container from '@sikundi/components/Container'
import IslandForm from '@sikundi/components/forms/IslandForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    island:any 
    atolls:any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <IslandForm type='update' data={props.island} atolls={props?.atolls} />
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
    let island
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        island = await prisma.islands.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                name: true,
                atoll: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }
    if (island) {
        const atolls = await prisma.atolls.findMany({
            select: {
                name: true,
                id: true
            }
        })
        return {
            props: {
                island: JSON.parse(JSON.stringify(island)),
                atolls: atolls
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