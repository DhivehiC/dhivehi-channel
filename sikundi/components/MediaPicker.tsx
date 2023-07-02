import React, { FC, forwardRef, Fragment, InputHTMLAttributes, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useDebounce } from 'usehooks-ts'
import Button from './Button'
import Heading from './Heading'
import ImageUploader from './ImageUploader'
import Img from './Img'
import Input from './Input'

interface Props {
    state: any
    callback: Function
    focus: Function
}

const MediaPicker:FC<Props> = (props) => {
    const [searchvalue, setSearchValue] = useState<string>('')
    const search = useDebounce<string>(searchvalue, 500)
    const [ modal, setModal ] = useState(false)
    const [ images, setImages ] = useState<any>([])
    const [ meta, setMeta ] = useState({totalPages: 0, current: 0})
    const [ loading, setLoading ] = useState(false)
    const [ active, setActive ] = props.state
    const styles = twMerge([
        
        // props.className && props.className
    ])
    useEffect(() => {
        fetchMedia()
    }, [search, active])

    function fetchMedia() {
        setLoading(true)
        if (active) {
            fetch(`/api/media-library${searchvalue.length > 0 ? `?search=${search}&` : "?"}page=${Number(meta.current)+1}`).then(async (res)=>{
                const resJson = await res.json()
                if (!resJson.authorizationError && !resJson.error) {
                    if (images?.length === 0 && searchvalue.length > 0) {
                        setImages(resJson.media)
                    } else {
                        setImages([...images, ...resJson.media])
                    }
                    setMeta({
                        totalPages: Number(resJson?.totalPages),
                        current: Number(resJson?.current)
                    })
                }
            }).finally(()=>{
                setLoading(false)
            })
        } else {
            setImages([])
        }
    }

    function uploadFetchMedia() {
        setLoading(true)
        if (active) {
            fetch(`/api/media-library?page=1`).then(async (res)=>{
                const resJson = await res.json()
                if (!resJson.authorizationError && !resJson.error) {
                    setImages(resJson.media)
                    setMeta({
                        totalPages: Number(resJson?.totalPages),
                        current: Number(resJson?.current)
                    })
                }
            }).finally(()=>{
                setLoading(false)
            })
        } else {
            setImages([])
        }
        
    }

    return (
        <Fragment>
            {active && <span className='fixed block bg-black opacity-50 inset-0 z-50' onClick={()=>{
                setActive(false)
                setMeta({totalPages: 0, current: 0})
            }}></span>}

            <div className={twMerge([
                'bg-secondary rounded-md transition-all opacity-100 visible',
                'fixed z-50 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]',
                'w-[90vw] max-h-[500px] max-w-[1050px] flex flex-col',
                'py-10 px-5',
                'overflow-y-auto',
                !active && 'invisible top-0 translate-y-0 opacity-0' 
            ])}>
                <Button className='ml-auto w-full lg:w-auto' type='button' onClick={(e)=>{
                    e.stopPropagation()
                    props.focus()
                    setModal(true)
                }}>
                    Add New Media
                </Button>
                <Input placeholder='search' className='mb-5' value={searchvalue} onChange={(e)=>{
                    e.stopPropagation()
                    setSearchValue(e.target.value)
                    setMeta({totalPages: 0, current: 0})
                    setImages([])
                }} />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                    {
                        images?.length > 0 &&
                        images?.map((item:any, index:any)=>(
                            <Img src={item.url} alt={item.caption} key={index} className={"col-span-1 aspect-video rounded-md overflow-hidden bg-background"} objectFit="cover" onClick={(e)=>{
                                e.stopPropagation()
                                props.callback(item.url, item.caption)
                                setMeta({totalPages: 0, current: 0})
                                setActive(false)
                            }} />
                        ))
                    }
                    {
                        (loading && images?.length < 0) &&
                        <Heading level={20} className="text-center text-accent col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-5">{
                            search.length > 0 ?
                            `No item Found that relates to ${search}` :
                            `No Media Found`
                        }</Heading>
                    }
                    {
                        loading &&
                        Array.from(Array(10).keys()).map((item, index)=>(
                            <div className='bg-background w-full aspect-video rounded-md animate-pulse' key={index}></div>
                        ))
                    }
                </div>
                {
                    meta?.totalPages > meta?.current &&
                    <Button className='mx-auto w-full lg:w-auto mt-6 px-5' type='button' loading={loading} onClick={()=>{
                        fetchMedia()
                    }}>
                        Load More
                    </Button>
                }
            </div>
            <ImageUploader state={[modal, setModal]} name={"mediapicker"} id={'mediapicker'} focus={()=>props?.focus()} callback={function(media:any) {
                props.callback(media.url, media.caption)
                setMeta({totalPages: 0, current: 0})
                setActive(false)
                setMeta({totalPages: 0, current: 0})
                setImages([])
                uploadFetchMedia()
            }} />
        </Fragment>
    )
}

export default MediaPicker