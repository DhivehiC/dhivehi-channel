import Container from '@sikundi/components/Container'
import TagForm from '@sikundi/components/forms/TagForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'

interface Props {}

const Page: NextPageWithLayout<Props> = () => {
    return (
        <Fragment>
            <Container>
                <TagForm type='create' />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Create a tag | sikundi</title>
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