import React, { FC, Fragment, useContext, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useForm, SubmitHandler } from "react-hook-form"
import Button from '../Button'
import Input from '../Input'
import Label from '../Label'
import { NotificationContext } from '@sikundi/layouts/RootLayout'
import { useRouter } from 'next/router'
import Select from '../Select'

interface Props {
    type: 'create' | 'update'
    data?: {
        id: number,
        box_number?: string
        name?: string
        island?: any
        eligible?: number
        voted?: number
        no_show?: number
        void?: number
        ibu?: number
        anni?: number
    }
    islands?: any
}

type Inputs = {
    box_number?: string,
    name?: string,
    island?: string,
    eligible?: number,
    no_show?: number,
    void?: number,
    ibu?: number,
    anni?: number,
}

const TagForm:FC<Props> = (props) => {
    const [loading, setLoading] = useState(false)
    const [ errors, setErrors ] = useState<any>({})
    const [notification, setNotification] = useContext(NotificationContext)
    const router = useRouter()
    const { register, handleSubmit } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data:any) => {
        setLoading(true)
        if (props.type === "create") {
            fetch('/api/primary/create', {
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
                    router.push(`/primary/${resJson.voteBox.id}/update`)
                }
            }).catch((e)=>{
    
            }).finally(()=>{
                setLoading(false)
            })
        }
        if (props.type === "update") {
            fetch(`/api/primary/update`, {
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
                    router.push(`/primary`)
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
                    <Label htmlFor='box_number'>Box Number</Label>
                    <Input 
                        id='box_number' placeholder='Box Number' type={'text'} dir={'ltr'}
                        defaultValue={props.data?.box_number}
                        errors={errors?.box_number}
                        {...register('box_number', {
                            required: true
                        })}
                    />
                    <Label htmlFor='name'>Name</Label>
                    <Input 
                        id='name' placeholder='Name' type={'text'} dir={'ltr'}
                        defaultValue={props.data?.name}
                        errors={errors?.name}
                        {...register('name', {
                            required: true
                        })}
                    />
                    <Label htmlFor='island'>Island</Label>
                    <Select className='w-full mb-2 py-3' required defaultValue={props.data?.island?.id} {...register('island')}>
                        {
                            props.islands?.map((island:any, index:number)=>(
                                <option value={island.id} key={index}>{island.name}</option>
                            ))
                        }
                    </Select>
                    <Label htmlFor='eligible'>Eligable</Label>
                    <Input 
                        id='eligible' placeholder='Eligable' type={'number'} dir={'ltr'}
                        defaultValue={props.data?.eligible}
                        errors={errors?.eligible}
                        {...register('eligible', {

                        })}
                    />
                    <Label htmlFor='no_show'>No Show</Label>
                    <Input 
                        id='no_show' placeholder='No Show' type={'number'} dir={'ltr'}
                        defaultValue={props.data?.no_show}
                        errors={errors?.no_show}
                        {...register('no_show', {

                        })}
                    />
                    <Label htmlFor='void'>Void</Label>
                    <Input 
                        id='void' placeholder='Void' type={'number'} dir={'ltr'}
                        defaultValue={props.data?.void}
                        errors={errors?.void}
                        {...register('void', {

                        })}
                    />
                    <Label htmlFor='ibu'>Ibu</Label>
                    <Input 
                        id='ibu' placeholder='Ibu' type={'number'} dir={'ltr'}
                        defaultValue={props.data?.ibu}
                        errors={errors?.ibu}
                        {...register('ibu', {

                        })}
                    />
                    <Label htmlFor='anni'>Anni</Label>
                    <Input 
                        id='anni' placeholder='Anni' type={'number'} dir={'ltr'}
                        defaultValue={props.data?.anni}
                        errors={errors?.anni}
                        {...register('anni', {

                        })}
                    />
                </div>
            </form>    
        </Fragment>
    )
}

export default TagForm