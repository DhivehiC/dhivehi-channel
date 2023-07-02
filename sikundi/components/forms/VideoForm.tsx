import React, { FC, Fragment, useContext, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import Input from '../Input'
import Label from '../Label'
import { NotificationContext } from '@sikundi/layouts/RootLayout'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler } from "react-hook-form"
import DropDown from '../DropDown'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon'
import dayjs from 'dayjs'
import WYSIWYG from '../WYSIWYG'
import Select from '../Select'

interface Props {
    type: 'create' | 'update'
    data?: {
        id?: string
        title?: string
        latin_title?: string
        long_title?: string
        content?: string
        yt_url?: string
        published_at?: string
        deleted_at?: string
        created_by?: any
    },
    preview_url?: string
    revalidation?: {
        url: string
        secret: string
    }
    authors?: {
        email: string
        user_name: string
    }[]
}

type Inputs = {
    title: string
    latin_title: string
    long_title: string
    content: string
    yt_url: string
    published_at: string
    author: string
}

const ArticleForm:FC<Props> = (props) => {
    const [loading, setLoading] = useState({ drafted: false, published: false, deleted: false, forceDelete: false })
    const [ errors, setErrors ] = useState<any>({})
    const [notification, setNotification] = useContext(NotificationContext)
    const router = useRouter()
    const [action, setAction] = useState<'drafted' | 'published' | 'deleted' | 'forceDelete'>('drafted')
    const { register, handleSubmit } = useForm<Inputs>()
    const content:any = useRef()

    const onSubmit: SubmitHandler<Inputs> = (data:any) => {
        action === "drafted" && setLoading({...loading, drafted: true})
        action === "published" && setLoading({...loading, published: true})
        action === "deleted" && setLoading({...loading, deleted: true})
        action === "forceDelete" && setLoading({...loading, forceDelete: true})
        
        if (props.type === "create") {
            fetch('/api/videos/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, content: content.current.innerHTML })
            }).then(async (res)=>{
                const resJson = await res.json()
                setErrors(resJson?.error?.validationErrors)
                if (resJson?.notification) {
                    setNotification(resJson?.notification)
                }
                if (!resJson.error) {
                    router.push(`/videos/${resJson.video.id}/update`)
                }
            }).catch((e)=>{
    
            }).finally(()=>{
                setLoading({ drafted: false, published: false, deleted: false, forceDelete: false })
            })
        }
        if (props.type === "update") {
            fetch(`/api/videos/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, id: props.data?.id, status: action, content: content.current.innerHTML })
            }).then(async (res)=>{
                const resJson = await res.json()
                setErrors(resJson?.error?.validationErrors)
                if (resJson?.notification) {
                    setNotification(resJson?.notification)
                }
                if ((!resJson.error && resJson.forceDelete) || (!resJson.error && action === "deleted")) {
                    router.push(`/videos`)
                }
            }).catch((e)=>{
                
            }).finally(()=>{
                setLoading({ drafted: false, published: false, deleted: false, forceDelete: false })
            })
        }
        setAction("drafted")
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4 flex flex-wrap gap-3'>
                    {
                        props.data?.deleted_at ?
                        <Button className='bg-danger px-4' disabled={props.type !== "update"} onClick={()=>setAction("forceDelete")} loading={loading.forceDelete} type={'submit'}>
                            Delete
                        </Button> : 
                        <Button className='bg-danger px-4' disabled={props.type !== "update"} onClick={()=>setAction("deleted")} loading={loading.deleted} type={'submit'}>
                            Trash
                        </Button>
                    }
                    <Button className='bg-secondary px-4 ml-auto' disabled={props.type !== "update"} type={'button'} onClick={()=>{
                        router.push(`${props.preview_url}?token=123&id=${props.data?.id}`)
                    }}>
                        Preview
                    </Button>
                    <Button className='bg-secondary px-4' type={'submit'} loading={loading.drafted}>
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
                    'p-4 lg:p-6 bg-secondary rounded-lg mb-4'
                ])}>
                    <Label htmlFor='title'>Title</Label>
                    <Input 
                        id='title' placeholder='Title' type={'text'} dir={'rtl'} required
                        defaultValue={props.data?.title}
                        errors={errors?.title}
                        {...register('title', {
                            required: true
                        })}
                    />
                    <Label htmlFor='long_title'>Long Title</Label>
                    <Input 
                        id='long_title' placeholder='Long Title' type={'text'} dir={'rtl'} required
                        defaultValue={props.data?.long_title}
                        errors={errors?.long_title}
                        {...register('long_title', {
                            required: true
                        })}
                    />
                    <Label htmlFor='latin_title'>Latin Title</Label>
                    <Input 
                        id='latin_title' placeholder='Latin TItle' type={'text'}  required
                        defaultValue={props.data?.latin_title}
                        errors={errors?.latin_title}
                        {...register('latin_title', {
                            required: true
                        })}
                    />
                    {
                        props?.type === "update" &&
                        <Fragment>
                            <Label htmlFor='Author'>Author</Label>
                            <Select className='w-full mb-2 py-3' defaultValue={props.data?.created_by?.email} {...register('author')}>
                                {
                                    props.authors?.map((author:any, index:number)=>(
                                        <option value={author.email} key={index}>{author.user_name}</option>
                                    ))
                                }
                            </Select>
                        </Fragment>
                    }
                    <Label htmlFor='yt_url'>Youtube Link</Label>
                    <Input 
                        id='yt_url' placeholder='Youtube Link' type={'url'}  required
                        defaultValue={props.data?.yt_url}
                        errors={errors?.yt_url}
                        {...register('yt_url', {
                            required: true
                        })}
                    />
                    <Label htmlFor='content'>Content</Label>
                    <WYSIWYG value={props.data?.content} ref={content} />
                </div>
            </form>    
        </Fragment>
    )
}

export default ArticleForm