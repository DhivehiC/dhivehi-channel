import { NotificationContext } from '@sikundi/layouts/RootLayout'
import React, { FC, Fragment, useContext, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import Input from '../Input'
import Label from '../Label'
import Heading from '../Heading';

interface Props {
    data: {
        id:number
        first_name:string
        last_name:string
        user_name:string
        email:string
    }
}

const UserSettingsForm:FC<Props> = (props) => {
    return (
        <Fragment>
            <InfoForm {...props} />
            <PsswdForm {...props} />
        </Fragment>
    )
}

export default UserSettingsForm

type InfoInputs = {
    first_name?:string
    last_name?:string
    user_name?:string
    email?:string
}
function InfoForm(props:Props) {
    const [infoLoading, setInfoLoading] = useState(false)
    const [ errors, setErrors ] = useState<any>({})
    const [notification, setNotification] = useContext(NotificationContext)
    const { register, handleSubmit } = useForm<InfoInputs>()

    const infoSubmit: SubmitHandler<InfoInputs> = (data:any) => {
        setInfoLoading(true)
        fetch('/api/settings/update/info', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...data, id: props.data.id })
        }).then(async (res)=>{
            const resJson = await res.json()
            setErrors(resJson?.error?.validationErrors)
            if (resJson?.notification) {
                setNotification(resJson?.notification)
            }
        }).catch((e)=>{

        }).finally(()=>{
            setInfoLoading(false)
        })
    }
    return (
        <form onSubmit={handleSubmit(infoSubmit)} className={twMerge([
            'p-4 lg:p-6 bg-secondary rounded-lg mb-8'
        ])}>
            <div className='flex items-center mb-4'>
                <Heading level={24} className="text-accent">User Details</Heading>
                <Button className='bg-success px-4 ml-auto' loading={infoLoading} type={'submit'}>
                    Save
                </Button>
            </div>
            <Label htmlFor='first_name'>First Name</Label>
            <Input 
                id='first_name' placeholder='First Name' type={'text'} required
                defaultValue={props.data?.first_name}
                errors={errors?.firstName}
                {...register("first_name", {
                    required: true
                })} 
            />
            <Label htmlFor='last_name'>Last Name</Label>
            <Input 
                id='last_name' placeholder='Last Name' type={'text'} required
                defaultValue={props.data?.last_name}
                errors={errors?.lastName}
                {...register("last_name", {
                    required: true
                })} 
            />
            <Label htmlFor='user_name'>User Name</Label>
            <Input 
                id='user_name' placeholder='User Name' type={'text'} required
                defaultValue={props.data?.user_name}
                errors={errors?.userName}
                {...register("user_name", {
                    required: true
                })} 
            />
            <Label htmlFor='email'>Email</Label>
            <Input 
                id='email' placeholder='Email' type={'text'} required
                defaultValue={props.data?.email}
                errors={errors?.email}
                {...register("email", {
                    required: true
                })} 
            />
        </form>
    )
}

type PsswdInputs = {
    current_password?:string
    new_password?:string
    confirm_password?:string
}
function PsswdForm(props:Props) {
    const [psswdLoading, setPsswdLoading] = useState(false)
    const [ errors, setErrors ] = useState<any>({})
    const [notification, setNotification] = useContext(NotificationContext)
    const { register, handleSubmit, reset } = useForm<PsswdInputs>()

    const passwdSubmit: SubmitHandler<PsswdInputs> = (data:any) => {
        setPsswdLoading(true)
        fetch('/api/settings/update/password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...data, id: props.data.id })
        }).then(async (res)=>{
            const resJson = await res.json()
            setErrors(resJson?.error?.validationErrors)
            if (resJson?.notification) {
                setNotification(resJson?.notification)
                reset()
            }
        }).catch((e)=>{

        }).finally(()=>{
            setPsswdLoading(false)
        })
    }
    
    return (
        <form onSubmit={handleSubmit(passwdSubmit)} className={twMerge([
            'p-4 lg:p-6 bg-secondary rounded-lg mb-8'
        ])}>
            <div className='flex items-center mb-4'>
                <Heading level={24} className="text-accent">Passwords</Heading>
                <Button className='bg-success px-4 ml-auto' loading={psswdLoading} type={'submit'}>
                    Save
                </Button>
            </div>
            <Label htmlFor='current_password'>Current Password</Label>
            <Input 
                id='current_password' placeholder='Current Password' type={'password'} required
                errors={errors?.currentPassword}
                {...register("current_password", {
                    required: true
                })} 
            />
            <Label htmlFor='new_password'>New Password</Label>
            <Input 
                id='new_password' placeholder='New Password' type={'password'} required
                errors={errors?.newPassword}
                {...register("new_password", {
                    required: true
                })} 
            />
            <Label htmlFor='confirm_password'>Confirm Password</Label>
            <Input 
                id='confirm_password' placeholder='Confirm Password' type={'password'} required
                errors={errors?.confirmPassword}
                {...register("confirm_password", {
                    required: true
                })} 
            />
        </form>
    )
}