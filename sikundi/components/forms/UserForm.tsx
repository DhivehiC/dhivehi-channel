import React, { FC, Fragment, useContext, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import Heading from '../Heading'
import Input from '../Input'
import Label from '../Label'
import TextArea from '../TextArea'
import { NotificationContext } from '@sikundi/layouts/RootLayout'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler } from "react-hook-form"
import DropDown from '../DropDown'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon'
import dayjs from 'dayjs'
import WYSIWYG from '../WYSIWYG'
import ImagePicker from '../ImagePicker'
import Select from '../Select'

interface Props {
    type: 'create' | 'update'
    data?: {
        id?: string
        first_name: string
        last_name: string
        user_name: string
        email: string
        password: string
        role: string
        status: string
    }
}

type Inputs = {
    first_name: string
    last_name: string
    user_name: string
    email: string
    password: string
    role: string
}

const ArticleForm:FC<Props> = (props) => {
    const [loading, setLoading] = useState({ create: false, update: false, ban: false })
    const [ errors, setErrors ] = useState<any>({})
    const [notification, setNotification] = useContext(NotificationContext)
    const router = useRouter()
    const [action, setAction] = useState<'create' | 'update' | 'ban'>('create')
    const { register, handleSubmit, setValue, getValues } = useForm<Inputs>()
    const content:any = useRef()
    const feature_image:any = useRef()

    const onSubmit: SubmitHandler<Inputs> = (data:any) => {
        action === "create" && setLoading({...loading, create: true})
        action === "update" && setLoading({...loading, update: true})
        action === "ban" && setLoading({...loading, ban: true})
        
        if (props.type === "create") {
            fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(async (res)=>{
                const resJson = await res.json()
                setErrors(resJson?.error?.validationErrors)
                if (resJson?.notification) {
                    setNotification(resJson?.notification)
                }
                if (!resJson.error) {
                    router.push(`/users/${resJson.user.id}/update`)
                }
            }).catch((e)=>{
    
            }).finally(()=>{
                setLoading({ create: false, update: false, ban: false })
            })
        }
        if (props.type === "update") {
            fetch(`/api/users/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...data, status: (action === "create" || action === "update") ? "active" : "banned", id: props?.data?.id })
            }).then(async (res)=>{
                const resJson = await res.json()
                console.log(resJson)
                setErrors(resJson?.error?.validationErrors)
                if (resJson?.notification) {
                    setNotification(resJson?.notification)
                }
                if ((!resJson.error && resJson.forceDelete) || (!resJson.error)) {
                    router.push(`/users`)
                }
            }).catch((e)=>{

            }).finally(()=>{
                setLoading({ create: false, update: false, ban: false })
            })
        }
        setAction("create")
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4 flex flex-wrap gap-3'>
                    <Button className='bg-danger px-4' disabled={props.type !== "update"} onClick={()=>setAction("ban")} loading={loading.ban} type={'submit'}>
                        Ban
                    </Button>
                    <Button className='bg-success px-4 ml-auto' onClick={()=>setAction(props.type === "update" ? "update": "create")} loading={loading.create || loading.update} type={'submit'}>
                        {props.type === "create" ? "Create" : props.data?.status === "banned" ? "activate" : "Update"}
                    </Button>
                </div>
                <div className={twMerge([
                    'p-4 lg:p-6 bg-secondary rounded-lg mb-4'
                ])}>
                    <Label htmlFor='first_name'>First Name</Label>
                    <Input 
                        id='first_name' placeholder='First Name' type={'text'} dir={'ltr'} required
                        defaultValue={props.data?.first_name}
                        errors={errors?.first_name}
                        {...register('first_name', {
                            required: true
                        })}
                    />
                    
                    <Label htmlFor='last_name'>Last Name</Label>
                    <Input 
                        id='last_name' placeholder='Last Name' type={'text'} dir={'ltr'} required
                        defaultValue={props.data?.last_name}
                        errors={errors?.last_name}
                        {...register('last_name', {
                            required: true
                        })}
                    />
                    
                    <Label htmlFor='user_name'>User Name</Label>
                    <Input 
                        id='user_name' placeholder='User Name' type={'text'} dir={'ltr'} required
                        defaultValue={props.data?.user_name}
                        errors={errors?.user_name}
                        {...register('user_name', {
                            required: true
                        })}
                    />
                    
                    <Label htmlFor='email'>Email</Label>
                    <Input 
                        id='email' placeholder='Email' type={'email'} dir={'ltr'} required
                        defaultValue={props.data?.email}
                        errors={errors?.email}
                        {...register('email', {
                            required: true
                        })}
                    />

                    <Label htmlFor='role'>Role</Label>
                    <Select className='w-full mb-2 py-3' defaultValue={props.data?.role} {...register('role')}>
                        <option value={"writers"}>Writer</option>
                        <option value={"admins"}>Admin</option>
                        <option value={"editors"}>Editor</option>
                    </Select>
                </div>
            </form>    
        </Fragment>
    )
}

export default ArticleForm