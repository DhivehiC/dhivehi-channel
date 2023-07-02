import Container from '@sikundi/components/Container'
import UserSettingsForm from '@sikundi/components/forms/UserSettingsForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app'
import { jwtVerify } from 'jose'
import { prisma } from '@sikundi/libs/server/prisma'
import cookie from 'cookie'

interface Props {
    user: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container>
                <UserSettingsForm data={props.user} />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>User Settings | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = cookie.parse(String(ctx.req.headers.cookie)).token
    const secret = process.env.ACCESS_TOKEN_SECRET
    let user = null
    if (token && secret) {
        const {payload} = await jwtVerify(String(token), new TextEncoder().encode(secret));
        user = payload
    }
    if (user?.id) {
        const userDetails = await prisma.users.findUnique({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                user_name: true,
                email: true
            },
            where: {
                id: parseInt(String(user.id))
            }
        })
        return {
            props: {
                user: userDetails
            }
        }
    }
    return {
        props: {
            
        }
    }
}

export default Page