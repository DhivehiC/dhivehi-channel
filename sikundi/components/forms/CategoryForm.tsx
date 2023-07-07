import { NotificationContext } from '@sikundi/layouts/RootLayout'
import { useRouter } from 'next/router';
import React, { FC, Fragment, useContext, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import DropDown from '../DropDown';
import Input from '../Input'
import Label from '../Label'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon'
import dayjs from 'dayjs'
import TextArea from '../TextArea';

interface Props {
    type: 'create' | 'update'
    data?: {
        id?: string
        title?: string
        latin_title?: string
        description?: string
        published_at?: string
    }
}

type Inputs = {
    title: string,
    latin_title: string,
    description?: string,
    published_at: string
}

const CategoryForm:FC<Props> = (props) => {
    const [loading, setLoading] = useState({ drafted: false, published: false, deleted: false })
    const [ errors, setErrors ] = useState<any>({})
    const [notification, setNotification] = useContext(NotificationContext)
    const router = useRouter()
    const [action, setAction] = useState<'drafted' | 'published' | 'deleted'>('drafted')
    const { register, handleSubmit } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data:any) => {
        action === "drafted" && setLoading({...loading, drafted: true})
        action === "published" && setLoading({...loading, published: true})
        action === "deleted" && setLoading({...loading, deleted: true})

        if (props.type === "create") {
            fetch('/api/articles/categories/create', {
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
                    router.push(`/articles/categories/${resJson.category.id}/update`)
                }
            }).catch((e)=>{
    
            }).finally(()=>{
                setLoading({ drafted: false, published: false, deleted: false })
            })
        }
        if (props.type === "update") {
            fetch(`/api/articles/categories/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, id: props.data?.id, status: action })
            }).then(async (res)=>{
                const resJson = await res.json()
                setErrors(resJson?.error?.validationErrors)
                if (resJson?.notification) {
                    setNotification(resJson?.notification)
                }
                if (!resJson.error) {
                    router.push(`/articles/categories`)
                }
            }).catch((e)=>{

            }).finally(()=>{
                setLoading({ drafted: false, published: false, deleted: false })
            })
        }
        setAction("drafted")
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4 flex flex-wrap gap-3'>
                    <Button className='bg-danger px-4' disabled={props.type !== "update"} onClick={()=>setAction("deleted")} loading={loading.deleted} type={'submit'}>
                        Delete
                    </Button>
                    <Button className='bg-secondary px-4 ml-auto' type={'submit'} loading={loading.drafted}>
                        Draft
                    </Button>
                    <div className='flex'>
                        <Button className='bg-success px-4 rounded-r-none' disabled={props.type !== "update"} onClick={()=>setAction("published")} loading={loading.published} type={'submit'}>
                            publish
                        </Button>
                        <DropDown head={<ChevronDownIcon className='h-4 w-4 text-accent' />} btnClassName={'p-3 bg-success rounded-md rounded-l-none border-l'} disabled={props.type !== "update"}>
                            <Label htmlFor='published_at'>Publish At</Label>
                            <Input 
                                id='published_at' type={'datetime-local'}
                                defaultValue={dayjs(props.data?.published_at).format('YYYY-MM-DD[T]hh[:]mm')}
                                errors={errors?.published_at}
                                {...register('published_at')}
                            />
                            <p className='text-accent'>Note: by default publish time is current time</p>
                        </DropDown>
                    </div>
                </div>
                <div className={twMerge([
                    'p-4 lg:p-6 bg-secondary rounded-lg'
                ])}>
                    <Label htmlFor='title'>Title</Label>
                    <Input 
                        id='title' placeholder='Title' type={'text'} dir={'rtl'} required
                        defaultValue={props.data?.title}
                        errors={errors?.title}
                        {...register("title", {
                            required: true
                        })} 
                    />
                    <Label htmlFor='latin_title'>Latin Title</Label>
                    <Input 
                        id='latin_title' placeholder='Latin TItle' type={'text'} required
                        defaultValue={props.data?.latin_title}
                        errors={errors?.latin_title}
                        {...register("latin_title", {
                            required: true
                        })} 
                    />
                    <Label htmlFor='discription'>Description</Label>
                    <TextArea 
                        id='description' placeholder='Description' rows={5} dir={'rtl'}
                        defaultValue={props.data?.description}
                        errors={errors?.description}
                        {...register('description', {
                            required: false
                        })}
                    />
                </div>
            </form>    
        </Fragment>
    )
}

export default CategoryForm