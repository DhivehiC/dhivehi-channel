import { NotificationContext } from '@sikundi/layouts/RootLayout'
import { useRouter } from 'next/router';
import React, { FC, Fragment, useContext, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import Input from '../Input'
import Label from '../Label'

interface Props {
    type: 'create' | 'update'
    data?: {
        id?: string
        name?: string
    }
}

type Inputs = {
    name: string,
}

const CategoryForm:FC<Props> = (props) => {
    const [loading, setLoading] = useState(false)
    const [ errors, setErrors ] = useState<any>({})
    const [notification, setNotification] = useContext(NotificationContext)
    const router = useRouter()
    const { register, handleSubmit } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data:any) => {
        setLoading(true)

        if (props.type === "create") {
            fetch('/api/primary/atolls/create', {
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
                    router.push(`/primary/atolls/${resJson.atoll.id}/update`)
                }
            }).catch((e)=>{
    
            }).finally(()=>{
                setLoading(false)
            })
        }
        if (props.type === "update") {
            fetch(`/api/primary/atolls/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, id: props.data?.id })
            }).then(async (res)=>{
                const resJson = await res.json()
                setErrors(resJson?.error?.validationErrors)
                if (resJson?.notification) {
                    setNotification(resJson?.notification)
                }
                if (!resJson.error) {
                    router.push(`/primary/atolls`)
                }
            }).catch((e)=>{

            }).finally(()=>{
                setLoading(false)
            })
        }

    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4 flex flex-wrap gap-3 justify-end'>
                    {
                        props.type === "update" ?
                        <Button className='bg-success px-4' loading={loading} type={'submit'}>
                            save
                        </Button>
                        :
                        <Button className='bg-success px-4' loading={loading} type={'submit'}>
                            create
                        </Button>
                    }
                </div>
                <div className={twMerge([
                    'p-4 lg:p-6 bg-secondary rounded-lg'
                ])}>
                    <Label htmlFor='name'>Name</Label>
                    <Input 
                        id='name' placeholder='Name' type={'text'} dir={'ltr'} required
                        defaultValue={props.data?.name}
                        errors={errors?.name}
                        {...register("name", {
                            required: true
                        })} 
                    />
                </div>
            </form>    
        </Fragment>
    )
}

export default CategoryForm