import AuthLayout from '@sikundi/layouts/AuthLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'
import type { NextPageWithLayout } from '../_app'
import logo from '../../public/image/brain.png'
import Image from 'next/image'
import Heading from '@sikundi/components/Heading'
import Input from '@sikundi/components/Input'
import Button from '@sikundi/components/Button'
import Link from 'next/link'

interface Props {}

const Page: NextPageWithLayout<Props> = () => {
    return (
        <Fragment>
            <form className={twMerge([
                'bg-secondary',
                'p-4 rounded-md w-full max-w-sm'
            ])}>
                <Image src={logo} alt={'logo'} className={'w-24 mx-auto mb-4'} />
                <Heading level={24} className="text-primary font-black text-center mb-4">Sikundi CMS</Heading>
                <Input type={'text'} placeholder="Email" required />
                <Input type={'password'} placeholder="OTP" className='mb-4' required />
                <Button className='bg-primary mb-3 w-full'>Reset</Button>
            </form>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Sign In | Sikundi CMS</title>
            </Head>
            <AuthLayout>
                {page}
            </AuthLayout>
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