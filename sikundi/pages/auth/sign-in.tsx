import AuthLayout from '@sikundi/layouts/AuthLayout'
import { useForm, SubmitHandler } from "react-hook-form";
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { FormEventHandler, Fragment, ReactElement, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import type { NextPageWithLayout } from '../_app'
import logo from '../../public/image/brain.png'
import Image from 'next/image'
import Heading from '@sikundi/components/Heading'
import Input from '@sikundi/components/Input'
import Button from '@sikundi/components/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'usehooks-ts'

interface Props {}

type Inputs = {
    email: string,
    password: string,
}

const Page: NextPageWithLayout<Props> = () => {
    const { register, handleSubmit } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data:any) => {
        setLoading(true)
        fetch('/api/auth/sign-in', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(async (res)=>{
            const resJson = await res.json()
            setErrors(resJson?.error?.validationErrors)
            if (resJson.user) {
                setUser(resJson?.user?.user)
                router.push('/')
            }
        }).catch((e)=>{

        }).finally(()=>{
            setLoading(false)
        })
    };
    
    const [ loading, setLoading ] = useState(false)
    const [ errors, setErrors ] = useState<any>({})
    const [user, setUser] = useLocalStorage('user', null)
    const router = useRouter()

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)} className={twMerge([
                'bg-secondary shadow-lg',
                'p-4 rounded-md max-w-md w-full'
            ])}>
                <Image priority src={logo} alt={'logo'} className={'w-24 mx-auto mb-4'} />
                <Heading level={24} className="text-primary font-black text-center mb-4">Sikundi App</Heading>
                
                <Input
                    type={'email'} placeholder="Email" required 
                    {...register("email", {
                        required: true
                    })} 
                    errors={errors?.email}
                />
                <Input 
                    type={'password'} placeholder="password" className='mb-4' required 
                    {...register("password", {
                        required: true
                    })} 
                    errors={errors?.password}
                />
                
                <Button className='bg-primary mb-3 flex items-center justify-center w-full' type={'submit'} loading={loading}>
                    Log In
                </Button>
                
                <Link href={'/auth/reset'} className="block text-center text-primary font-bold hover:opacity-75 active:opacity-50">Forgot Password? reset</Link>
            
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

export default Page