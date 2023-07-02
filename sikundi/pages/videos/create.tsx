import Container from '@sikundi/components/Container'
import VideoForm from '@sikundi/components/forms/VideoForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app'

interface Props {
    tags: any
    categories: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    return (
        <Fragment>
            <Container className='py-5'>
                <VideoForm type='create' />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Create a vedio | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        props: {
            
        }
    }
}

export default Page