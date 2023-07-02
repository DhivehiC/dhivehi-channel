import React, { FC, Fragment, useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from './Heading'
import Img from './Img'
import Button from './Button'
import axios from 'axios'
import { NotificationContext } from '@sikundi/layouts/RootLayout'
import { useRouter } from 'next/router'

interface Props {
    state?: any
    data?: any
}

const ImageViewer:FC<Props> = (props) => {
    const [ active, setActive ] = props.state
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()
    const [notification, setNotification] = useContext(NotificationContext)

    return (
        <Fragment>
            {active && <span className='fixed block bg-black opacity-50 inset-0 z-50' onClick={()=>{
                setActive(false)
            }}></span>}
            <div className={twMerge([
                ' w-[75%] max-w-5xl bg-secondary z-50 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all flex flex-col p-4 rounded-md',
                active ? 'visible scale-100' : 'invisible scale-0'
            ])}>
                <Img src={props?.data?.url} alt={`caption-`} className="w-full aspect-video bg-transparent mb-5" />
                <Heading level={24} className="text-accent truncate">{props?.data?.caption}</Heading>
                <Heading level={16} className="text-accent truncate">{props?.data?.tags}</Heading>
                <Heading level={16} className="text-accent text-right truncate">{props?.data?.created_by?.user_name}</Heading>
                <div className='flex items-center justify-end'>
                    <Button className='bg-danger my-3' loading={loading} onClick={async ()=>{
                        try {
                            setLoading(true)
                            const data = await (await fetch(`/api/media-library/delete?id=${props.data.id}`, {
                                method: "GET"
                            })).json()
                            setNotification(data)
                            setActive(false)
                            router.push('/media-library?reload=true')
                        } catch (error) {
                            setNotification({
                                title: `Media Deletion`, 
                                content: `An unknown error has occured`,
                                type: "failed"
                            })
                        } finally {
                            setLoading(false)
                        }
                    }}>
                        Delete
                    </Button>
                </div>
            </div>
        </Fragment>
    )
}

export default ImageViewer