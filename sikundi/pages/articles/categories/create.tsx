import Container from '@sikundi/components/Container'
import CategoryForm from '@sikundi/components/forms/CategoryForm'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'

interface Props {}

const Page: NextPageWithLayout<Props> = () => {
    return (
        <Fragment>
            <Container className='py-5'>
                <CategoryForm type='create' />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Create a category | sikundi</title>
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