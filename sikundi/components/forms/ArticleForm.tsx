import React, { FC, Fragment, useContext, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import Heading from '../Heading'
import Input from '../Input'
import Label from '../Label'
import TextArea from '../TextArea'
import { NotificationContext } from '@sikundi/layouts/RootLayout'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import DropDown from '../DropDown'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon'
import dayjs from 'dayjs'
import WYSIWYG from '../WYSIWYG'
import ImagePicker from '../ImagePicker'
import Select from '../Select'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useReadLocalStorage } from 'usehooks-ts'

interface Props {
    categories: any
    type: 'create' | 'update'
    data?: {
        id?: string
        title?: string
        latin_title?: string
        long_title?: string
        description?: string
        yt_url?: string
        content?: string
        category?: {
            id?: number
            title?: string
        },
        feature_image?: {
            url?: string
        },
        feature_image_caption?: string,
        post_tags?: any
        published_at?: string
        deleted_at?: string
        breaking?: boolean
        live_blog?: boolean
        created_by?: any
        updated_by?: any
    },
    preview_url?: string
    perma_url?: string
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
    description: string
    yt_url: string
    content: string
    feature_image_caption: string
    category: string
    tags: string
    published_at: string
    breaking: boolean
    live_blog: boolean
    author: string
    postToFacebook: boolean
    postToTwitter: boolean
    postToTelegram: boolean
}

const ArticleForm:FC<Props> = (props) => {
    const [loading, setLoading] = useState({ drafted: false, published: false, deleted: false, forceDelete: false })
    const [ errors, setErrors ] = useState<any>({})
    const [ otherUser, setOtherUser ] = useState<any>(null)
    const [notification, setNotification] = useContext(NotificationContext)
    const router = useRouter()
    const [action, setAction] = useState<'drafted' | 'published' | 'deleted' | 'forceDelete'>('drafted')
    const { register, handleSubmit, setValue, getValues, control } = useForm<Inputs>()
    const content:any = useRef()
    const feature_image:any = useRef()
    const CreatableSelect = dynamic(import('react-select/async-creatable'), {
        ssr: false
    })
    const usr:any = useReadLocalStorage('user')
    const [user, setUser] = useState<any>({})

    useEffect(()=>{
        setUser(usr)
        if (props.data?.updated_by?.user?.id) {
            const now = dayjs(new Date().toISOString())
            const date2 = dayjs(props.data?.updated_by.timestampz)

            if (props.data.updated_by.user.id !== usr.id && (now.diff(date2) < 15000)) {
                setOtherUser(props.data?.updated_by)
            } else {
                if (props.data?.id) {
                    fetch(`/api/articles/ping?id=${props.data?.id}`).then(async(res)=>{
                        const data = await res.json()
                        if (data.updated_by.user.id && (usr.id !== data.updated_by.user.id)) {
                            setOtherUser(data.updated_by)
                        }
                    }).catch((e)=>{
                        console.error(e)
                    }).finally(()=>{
                        console.log("pinged")
                    })
                }
                const ping = setInterval(() => {
                    if (props.data?.id) {
                        fetch(`/api/articles/ping?id=${props.data?.id}`).then(async(res)=>{
                            const data = await res.json()
                            if (data.updated_by.user.id && (usr.id !== data.updated_by.user.id)) {
                                setOtherUser(data.updated_by)
                            }
                        }).catch((e)=>{
                            console.error(e)
                        }).finally(()=>{
                            console.log("pinged")
                        })
                    }
                }, 10000);
                return () => clearInterval(ping);
            }
        } else {
            if (props.data?.id) {
                fetch(`/api/articles/ping?id=${props.data?.id}`).then(async(res)=>{
                    const data = await res.json()
                    if (data.updated_by.user.id && (usr.id !== data.updated_by.user.id)) {
                        setOtherUser(data.updated_by)
                    }
                }).catch((e)=>{
                    console.error(e)
                }).finally(()=>{
                    console.log("pinged")
                })
            }
            const ping = setInterval(() => {
                if (props.data?.id) {
                    fetch(`/api/articles/ping?id=${props.data?.id}`).then(async(res)=>{
                        const data = await res.json()
                        if (data.updated_by.user.id && (usr.id !== data.updated_by.user.id)) {
                            setOtherUser(data.updated_by)
                        }
                    }).catch((e)=>{
                        console.error(e)
                    }).finally(()=>{
                        console.log("pinged")
                    })
                }
            }, 10000);
            return () => clearInterval(ping);
        }

    }, [])

    const onSubmit: SubmitHandler<Inputs> = (data:any) => {
        let tempPublish
        if (data.published_at) {
            tempPublish = new Date(data.published_at).toISOString() 
        }
        action === "drafted" && setLoading({...loading, drafted: true})
        action === "published" && setLoading({...loading, published: true})
        action === "deleted" && setLoading({...loading, deleted: true})
        action === "forceDelete" && setLoading({...loading, forceDelete: true})
        
        if (props.type === "create") {
            fetch('/api/articles/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, content: content.current.innerHTML, feature_image: feature_image.current.value, published_at: tempPublish })
            }).then(async (res)=>{
                const resJson = await res.json()
                setErrors(resJson?.error?.validationErrors)
                if (resJson?.notification) {
                    setNotification(resJson?.notification)
                }
                if (!resJson.error) {
                    router.push(`/articles/${resJson.article.id}/update`)
                }
            }).catch((e)=>{
    
            }).finally(()=>{
                setLoading({ drafted: false, published: false, deleted: false, forceDelete: false })
            })
        }
        if (props.type === "update") {
            fetch(`/api/articles/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, id: props.data?.id, status: action, content: content.current.innerHTML, feature_image: feature_image.current.value, published_at: tempPublish })
            }).then(async (res)=>{
                const resJson = await res.json()
                setErrors(resJson?.error?.validationErrors)
                if (resJson?.notification) {
                    setNotification(resJson?.notification)
                }
                if ((!resJson.error && resJson.forceDelete) || (!resJson.error)) {
                    router.push(`/articles`)
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
                {
                    otherUser &&
                    <div className='fixed bg-[#00000099] w-screen h-screen top-0 left-0 z-40 flex items-center justify-center p-4'>
                        <div className='bg-secondary px-4 py-12 z-50 w-full rounded-md max-w-lg'>
                            <h1 className='text-2xl font-black text-danger mb-6 text-center'>ALERT</h1>
                            <p className='text-white text-center'>{`"${otherUser.user.user_name}" is currently editing this article`}</p>
                        </div>
                    </div>
                }
                <div className='mb-4 flex flex-wrap gap-3'>
                    {
                        props.data?.deleted_at ?
                        (
                            (user?.role === "editors" || user?.role === "admins") && 
                            <Button className='bg-danger px-4' disabled={props.type !== "update"} onClick={()=>setAction("forceDelete")} loading={loading.forceDelete} type={'submit'}>
                                Delete
                            </Button> 
                        ) : 
                        <Button className='bg-danger px-4' disabled={props.type !== "update"} onClick={()=>setAction("deleted")} loading={loading.deleted} type={'submit'}>
                            Trash
                        </Button>
                    }
                    <Button className='bg-secondary px-4 ml-auto' disabled={props.type !== "update"} type={'button'} onClick={()=>{
                        router.push(`${props.preview_url}?token=123&id=${props.data?.id}`)
                    }}>
                        Preview
                    </Button>
                    {
                        props.data?.id &&
                        <Button className='bg-yellow-500 px-4' type={'button'} onClick={()=>{
                            router.push(`/articles/${props.data?.id}/comments`)
                        }}>
                            Comments
                        </Button>
                    }
                    <Button className='bg-secondary px-4' type={'submit'} loading={loading.drafted}>
                        Draft
                    </Button>
                    {
                        (user?.role === "editors" || user?.role === "admins") &&
                        <div className='flex'>
                            <Button className='bg-success px-4 rounded-r-none' disabled={props.type !== "update"} onClick={()=>setAction("published")} loading={loading.published} type={'submit'}>
                                publish
                            </Button>
                            <DropDown head={<ChevronDownIcon className='h-4 w-4 text-accent' />} btnClassName={'p-3 bg-success rounded-md rounded-l-none border-l'} disabled={props.type !== "update"}>
                                <Label htmlFor='published_at'>Publish At</Label>
                                <Input 
                                    id='published_at' type={'datetime-local'}
                                    defaultValue={dayjs(props.data?.published_at).format('YYYY-MM-DD[T]HH[:]mm')}
                                    errors={errors?.published_at}
                                    {...register('published_at')}
                                />
                                <p className='text-accent'>Note: by default publish time is current time</p>
                            </DropDown>
                        </div>
                    }
                </div>
                    {(props.perma_url && props.data?.published_at) && <Link href={props.perma_url} className="text-accent mb-4 inline-block hover:opacity-75 active:opacity-50">Perma Link: {props.perma_url}</Link>}
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
                    <Label htmlFor='discription'>Description</Label>
                    <TextArea 
                        id='description' placeholder='Description' rows={5} dir={'rtl'} required
                        defaultValue={props.data?.description}
                        errors={errors?.description}
                        {...register('description', {
                            required: true
                        })}
                    />
                    <Label htmlFor='yt_url'>Youtube Link</Label>
                    <Input 
                        id='yt_url' placeholder='Youtube Link' type={'url'}  required
                        defaultValue={props.data?.yt_url}
                        errors={errors?.yt_url}
                        {...register('yt_url', {
                            required: true
                        })}
                    />
                    <Label htmlFor='Author'>Author</Label>
                    <Select className='w-full mb-2 py-3' defaultValue={props.data?.created_by?.email} {...register('author')}>
                        {
                            props.authors?.map((author:any, index:number)=>(
                                <option value={author.email} key={index}>{author.user_name}</option>
                            ))
                        }
                    </Select>
                    <Label htmlFor='content'>Content</Label>
                    <WYSIWYG value={props.data?.content} ref={content} timeStamp={()=>{
                        return getValues('live_blog')
                    }} />
                </div>

                <div className='p-4 lg:p-6 bg-secondary rounded-lg mb-4'>
                    <Label htmlFor='feature_image'>Feature Image</Label>
                    <ImagePicker ref={feature_image} defaultValue={props.data?.feature_image?.url} onImageRemove={()=>setValue("feature_image_caption", "")} onImageInsert={(img:any)=>{
                        setValue("feature_image_caption", img?.caption)
                    }} />
                    <Input 
                        id='feature_image_caption' placeholder='Feature image caption' type={'text'} dir={'rtl'}
                        defaultValue={props.data?.feature_image_caption}
                        className="mt-3" 
                        errors={errors?.feature_image_caption}
                        {...register('feature_image_caption', {
                            required: false
                        })}
                    />
                </div>

                <div className='p-4 lg:p-6 bg-secondary rounded-lg mb-4'>
                    <div className='flex items-center gap-3 mb-2'>
                        <Input 
                            id={"breaking"} value={"breaking"} type={"checkbox"}
                            defaultChecked={props.data?.breaking}
                            {...register('breaking')}
                        />
                        <Label htmlFor={"breaking"} className="mb-0">Is this a breaking</Label>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Input 
                            id={"live_blog"} value={"live_blog"} type={"checkbox"}
                            defaultChecked={props.data?.live_blog}
                            {...register('live_blog')}
                        />
                        <Label htmlFor={"live_blog"} className="mb-0">Is this a live blog</Label>
                    </div>
                </div>

                {
                    props.type === "update" &&
                    <div className='p-4 lg:p-6 bg-secondary rounded-lg mb-4'>
                        <div className='flex items-center gap-3 mb-2'>
                            <Input 
                                id={"postToFacebook"} value={"postToFacebook"} type={"checkbox"}
                                defaultChecked={false}
                                {...register('postToFacebook')}
                            />
                            <Label htmlFor={"postToFacebook"} className="mb-0">Post this article to facebook</Label>
                        </div>
                        <div className='flex items-center gap-3 mb-2'>
                            <Input 
                                id={"postToTwitter"} value={"postToTwitter"} type={"checkbox"}
                                defaultChecked={false}
                                {...register('postToTwitter')}
                            />
                            <Label htmlFor={"postToTwitter"} className="mb-0">Post this article to twitter</Label>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Input 
                                id={"postToTelegram"} value={"postToTelegram"} type={"checkbox"}
                                defaultChecked={false}
                                {...register('postToTelegram')}
                            />
                            <Label htmlFor={"postToTelegram"} className="mb-0">Post this article to telegram</Label>
                        </div>
                    </div>
                }

                <div className={twMerge([
                    'p-4 lg:p-6 bg-secondary rounded-lg mb-4 grid lg:grid-cols-2 gap-4'
                ])}>
                    <div className='bg-background p-4 rounded-lg'>
                        <Heading level={18} className="text-accent font-bold mb-4">Category</Heading>
                        {
                            props.categories?.map((item:any, index:any)=>(
                                <div className='flex items-center gap-3 mb-2' key={index}>
                                    <Input 
                                        id={item?.title} value={item?.title} type={"radio"} required
                                        defaultChecked={props.data?.category?.title===item?.title}
                                        {...register('category', {
                                            required: true
                                        })}
                                    />
                                    <Label htmlFor={item?.title} className="mb-0">{item?.title}</Label>
                                </div>
                            ))
                        }
                    </div>
                    <div className='bg-background p-4 rounded-lg'>
                        <Heading level={18} className="text-accent font-bold mb-4">Tags</Heading>
                        <Controller
                            name="tags"
                            defaultValue={props.data?.post_tags?.map?.((tag:any)=>({
                                value: tag.tag.id, 
                                label: tag.tag.title
                            }))}
                            render={({ field }) => (
                                <CreatableSelect
                                    {...field}
                                    isMulti
                                    // options={props.tags?.map?.((tag:any)=>({
                                    //     value: tag.id, 
                                    //     label: tag.title
                                    // }))}
                                    loadOptions={fetchTags}
                                    styles={customStyles}
                                />
                            )}
                            control={control}
                        />
                    </div>
                </div>

            </form>    
        </Fragment>
    )
}

export default ArticleForm

const fetchTags = (search:string) => {
    return (
        new Promise<{value: string, label: string}[]>(async (resolve, reject)=>{
            const res = await fetch(`/api/articles/tags/search?query=${search}`)
            if (res.status == 200) {
                const data = await res.json()
                resolve(data?.map((item:any)=>({
                    value: item.id, 
                    label: item.title
                })))
            } else {
                resolve([])
            }
        })
    )
}

const customStyles = {
    control: (base:any, state:any) => ({
      ...base,
      background: "#283848",
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      borderColor: "transparent",
      color: "#CED9E0",
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        borderColor: state.isFocused ? "#CA2128" : "#CA2128"
      }
    }),
    menu: (base:any) => ({
      ...base,
      background: "#1A2530",
      color: "#CED9E0",
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base:any) => ({
      ...base,
      padding: 0,
      color: "#CED9E0",
    }),
    option: (base:any, {isFocused, isSelected}:any) => ({
        ...base,
        background: isFocused
            ? '#CA2128'
            : isSelected
                ? '#CA2128'
                : undefined,
        zIndex: 1,
        color: "#CED9E0",
    }),
    singleValue: (base:any) => ({
      ...base,
      color: '#CED9E0',
    }),
    input: (base:any) => ({
        ...base,
        color: '#CED9E0',
    }),
    multiValue: (base:any) => ({
        ...base,
        color: '#CED9E0',
        background: "#1A2530",
    }),
    multiValueLabel: (base:any) => ({
        ...base,
        color: '#CED9E0',
        background: "#1A2530",
    }),
    multiValueRemove: (base:any) => ({
        ...base,
        color: '#CED9E0',
        background: "#1A2530",
    }),
    clearIndicator: (base:any) => ({
        ...base,
        color: '#CED9E0',
    }),
    dropdownIndicator: (base:any) => ({
        ...base,
        color: '#CED9E0',
    }),
};