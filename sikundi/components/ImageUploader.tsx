import { NotificationContext } from '@sikundi/layouts/RootLayout'
import { useRouter } from 'next/router'
import React, { ChangeEventHandler, DragEventHandler, FC, Fragment, useContext, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useReadLocalStorage } from 'usehooks-ts'
import Button from './Button'
import Heading from './Heading'
import Img from './Img'
import Input from './Input'
import TextArea from './TextArea'
import EXIF from "exif-js"
import exifr from 'exifr/dist/full.esm.mjs'
import * as ExifReader from 'exifreader';

interface Props {
    state?: any
    callback: Function
    focus?: Function
    name?: any
    id?: any
}

const ImageUploader:FC<Props> = (props) => {
    const inputRef = useRef<any>()
    const [ files, setFiles ] = useState<any>(null)
    const [ active, setActive ] = props.state
    const [loading, setLoading] = useState(false)
    const user:any = useReadLocalStorage('user')
    const router = useRouter()
    const [notification, setNotification] = useContext(NotificationContext)

    const handleDrop:DragEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault()
        setFiles(createList(event.dataTransfer.files))
    }
    const handleDragOver:DragEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault()
    }
    const pickFile:ChangeEventHandler<HTMLInputElement> = (event) => {
        setFiles(createList(event.target.files))
    }
    function createList(fileElements:FileList|null) {
        let res:any = []
        if (fileElements) {
            if (files) {
                res = files
            }
            Array.from(fileElements).map(async (file:any, index:number)=>{
                res?.push({
                    author: user.user_name,
                    tags: "",
                    caption: file.name,
                    image: file
                })
            })
        }
        return res
    }

    async function upload() {
        try {
            setLoading(true)
            await Promise.all(files.map(async (item:any)=>{
                let form = new FormData()
                form.append("file", item.image)
                const res = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/upload`, {
                    method: "POST",
                    headers: {
                        'api-key': 'rP3T4X2bwO9Y6jU7dFqE1cL5iG8vN0zMnBhKlS'
                    },
                    body: form
                })
                const resJSON = await res.json()
                if (resJSON.success) {
                    const media = await (await fetch('/api/media-library', {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            tags: item.tags,
                            caption: item.caption,
                            url: `${process.env.NEXT_PUBLIC_UPLOAD_URL}${resJSON.url}`
                        })
                    })).json()
                    props.callback(media?.media)
                    if (media?.notification) {
                        setNotification(media?.notification)
                    }
                    if (media?.error) {
                        console.log(media?.error)
                        setNotification({ title: "error", content: `an unknown error occured`, type: "failed" })
                    }
                }
            }))
        } catch (error) {
            console.log(error)
        } finally {
            setFiles(null)
            setActive(false)
            setLoading(false)
        }
    }

    return (
        <Fragment>
            {active && <span className='fixed block bg-black opacity-50 inset-0 z-50' onClick={()=>{
                setActive(false)
                setFiles(false)
            }}></span>}
            
            {
                files && files.length > 0 ?
                <div className={twMerge([
                    'bg-secondary rounded-md transition-all opacity-100 visible',
                    'fixed z-50 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]',
                    'h-[90vh] w-[90vw] max-h-[500px] max-w-[1050px]',
                    !active && 'invisible top-0 translate-y-0 opacity-0' 
                ])}>
                    <span className='h-full w-full p-6 flex flex-col items-center justify-center'>
                        <ul className='h-full overflow-y-auto mb-4 relative w-full'>
                            {
                                Array.from(files).map((file:any, id)=>(
                                    <li key={id}>                                            
                                        <ImageItem image={file.image} caption={file.caption} author={file.author} state={[files, setFiles]} id={id} />
                                    </li>
                                ))
                            }
                        </ul>
                        <Button type='button' className='w-full mb-3 flex items-center justify-center' loading={loading} onClick={(e)=>{
                            e.stopPropagation()
                            upload()
                        }}>
                            Upload
                        </Button>
                        <Button type='button' className='w-full mb-0 bg-danger' onClick={(e)=>{
                            e.stopPropagation()
                            setActive(false)
                            setFiles(null)
                        }}>
                            Cancel
                        </Button>
                    </span> 
                </div>:
                <button onDragOver={handleDragOver} type="button" onClick={(e)=>{
                    e.stopPropagation()
                    if (props.focus) {
                        props.focus()
                    }
                    inputRef.current.click()
                }} onDrop={handleDrop} className={twMerge([
                    'bg-secondary rounded-md transition-all opacity-100 visible',
                    'fixed z-50 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]',
                    'h-[90vh] w-[90vw] max-h-[500px] max-w-[1050px]',
                    !active && 'invisible top-0 translate-y-0 opacity-0' 
                ])}>
                    <span className='overflow-y-auto h-full w-full p-6 lg:p-12 flex flex-col items-center justify-center'>
                        <Heading level={60} className="text-accent text-center font-normal uppercase mb-3">Drag Images Here</Heading>
                        <Heading level={20} className="text-background text-center font-normal uppercase">Or Click Here</Heading>
                    </span>
                </button>
            }
            <input type="file" name={props.name} id={props.id} multiple onChange={pickFile} hidden ref={inputRef} />
        </Fragment>
    )
}

export default ImageUploader

interface ImageProps {
    image?: any,
    author?: string,
    tags?: string,
    caption?: string,
    state?: any,
    id: number
}

export const ImageItem:FC<ImageProps> = (props) => {
    const [files, setFiles] = props.state
    const caption = useRef<any>(null)
    useEffect(()=>{
        (async ()=>{
            const data = await ExifReader.load(props.image)
            caption.current.value = data['Caption/Abstract']?.description || files[props.id]?.caption
            let temp = [...files]
            temp[props.id] = {
                author: temp[props.id].author,
                tags: temp[props.id].tags,
                caption: data['Caption/Abstract']?.description || files[props.id]?.caption,
                image: temp[props.id].image
            }
            setFiles(temp)
        })()
    }, [])
    return (
        <div className={twMerge([
            'lg:grid grid-cols-4 w-full gap-4 mb-6 lg:mb-4'
        ])}>
            <div className='col-span-1 min-h-full relative'>
                <Img alt="image" src={URL.createObjectURL(props.image)} className="aspect-video w-full bg-background rounded-md mb-3 lg:mb-0 overflow-hidden" objectFit='cover' />
            </div>
            <div className='col-span-1 min-h-full'>
                <Input placeholder='author' className='mb-1' readOnly defaultValue={props.author} onChange={(e)=>{
                    let temp = [...files]
                    temp[props.id] = {
                        author: e.target.value,
                        tags: temp[props.id].tags,
                        caption: temp[props.id].caption,
                        image: temp[props.id].image
                    }
                    setFiles(temp)
                }} />
                <TextArea placeholder='Tags' rows={3} className="mb-0 resize-none" defaultValue={props.tags} onChange={(e)=>{
                    let temp = [...files]
                    temp[props.id] = {
                        author: temp[props.id].author,
                        tags: e.target.value,
                        caption: temp[props.id].caption,
                        image: temp[props.id].image
                    }
                    setFiles(temp)
                }} />
            </div>
            <div className='col-span-2 min-h-full'>
                <TextArea ref={caption} placeholder='Caption' rows={5} className="mb-0 resize-none" defaultValue={props.caption} onChange={(e)=>{
                    let temp = [...files]
                    temp[props.id] = {
                        author: temp[props.id].author,
                        tags: temp[props.id].tags,
                        caption: e.target.value,
                        image: temp[props.id].image
                    }
                    setFiles(temp)
                }} />
            </div>
        </div>
    )
}