import Container from '@sikundi/components/Container'
import UserForm from '@sikundi/components/forms/UserForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'
import { prisma } from '@sikundi/libs/server/prisma'

interface Props {
    user:any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <UserForm type='update' data={props.user} />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Update a User | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let user
    if (ctx?.params?.id) {
        const temp:any = ctx.params.id
        const id = temp
        user = await prisma.users.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                user_name: true,
                email: true,
                password: true,
                role: true,
                status: true
            }
        })
    }
    if (user) {
        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
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