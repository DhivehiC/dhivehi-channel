import Container from '@sikundi/components/Container'
import BoxForm from '@sikundi/components/forms/BoxForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    voteBox:any
    islands:any 
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <BoxForm type='update' data={props.voteBox} islands={props.islands} />
            </Container> 
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Update a box | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let voteBox
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        voteBox = await prisma.voteBoxes.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                box_number: true,
                name: true,
                island: true,
                eligible: true,
                no_show: true,
                void: true,
                ibu: true,
                anni: true
            }
        })
    }
    if (voteBox) {
        const islands = await prisma.islands.findMany({
            select: {
                name: true,
                id: true
            }
        })
        return {
            props: {
                voteBox: JSON.parse(JSON.stringify(voteBox)),
                islands: islands
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