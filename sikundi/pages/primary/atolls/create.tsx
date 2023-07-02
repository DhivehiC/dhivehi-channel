import Container from '@sikundi/components/Container'
import AtollForm from '@sikundi/components/forms/AtollForm'
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
                <AtollForm type='create' />
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Create a atoll | sikundi</title>
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