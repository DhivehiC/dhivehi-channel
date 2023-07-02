import Sidebar from '@sikundi/components/Sidebar'
import SidebarItem from '@sikundi/components/Sidebar/SidebarItem'
import React, { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon'
import NewspaperIcon from '@heroicons/react/24/solid/NewspaperIcon'
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon'
import PhotoIcon from '@heroicons/react/24/solid/PhotoIcon'
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon'
import InformationCircleIcon from '@heroicons/react/24/solid/InformationCircleIcon'
import Cog8ToothIcon from '@heroicons/react/24/solid/Cog8ToothIcon'
import CameraIcon from '@heroicons/react/24/solid/CameraIcon'
import VideoCameraIcon from '@heroicons/react/24/solid/VideoCameraIcon'
import dynamic from 'next/dynamic'
import SidebarSubItem from '@sikundi/components/Sidebar/SidebarSubItem'
import { useRouter } from 'next/router'
import Header from '@sikundi/components/Header'
import { useReadLocalStorage } from 'usehooks-ts'

interface Props {
    children?: ReactNode
    pendingArticles?: any
}

const DashboardLayout:FC<Props> = (props) => {
    const [sidebarActive, setSidebarActive] = useState(false)
    const router = useRouter()
    const usr:any = useReadLocalStorage('user')
    const [user, setUser] = useState<any>({})

    useEffect(()=>{
        setUser(usr)
    }, [])
    
    useEffect(()=>{
        setSidebarActive(false)
    }, [router.query, router.pathname])
    return (
        <main className={twMerge([
            'bg-background',
            'w-full min-h-screen flex'
        ])}>
            <Sidebar state={[sidebarActive, setSidebarActive]}>
                <div className='mb-16'>
                    <SidebarItem href='/' active={router.pathname === "/"} icon={<ComputerDesktopIcon className='w-5 h-5' />}>
                        Dashboard
                    </SidebarItem>
                    <SidebarItem href='/articles' active={router.pathname?.startsWith("/articles")} icon={<NewspaperIcon className='w-5 h-5' />} subItems={
                        <Fragment>
                            <SidebarSubItem active={router.pathname?.startsWith("/articles/categories")} href='/articles/categories'>
                                Categories
                            </SidebarSubItem>
                            <SidebarSubItem active={router.pathname?.startsWith("/articles/tags")} href='/articles/tags'>
                                Tags
                            </SidebarSubItem>
                            <SidebarSubItem active={router.pathname?.startsWith("/articles/comments")} href='/articles/comments'>
                                Comments
                            </SidebarSubItem>
                        </Fragment>
                    }>
                        Articles
                    </SidebarItem>
                    {/* <SidebarItem href='/photos' active={router.pathname?.startsWith("/photos")} icon={<CameraIcon className='w-5 h-5' />}>
                        Photos
                    </SidebarItem>
                    <SidebarItem href='/videos' active={router.pathname?.startsWith("/videos")} icon={<VideoCameraIcon className='w-5 h-5' />}>
                        Videos
                    </SidebarItem> */}
                    <SidebarItem href='/media-library' active={router.pathname?.startsWith("/media-library")} icon={<PhotoIcon className='w-5 h-5' />}>
                        Media Library
                    </SidebarItem>
                    {/* <SidebarItem href='/primary' active={router.pathname?.startsWith("/primary")} icon={<ArchiveBoxIcon className='w-5 h-5' />} subItems={
                        <Fragment>
                            <SidebarSubItem active={router.pathname?.startsWith("/primary/atolls")} href='/primary/atolls'>
                                Atolls
                            </SidebarSubItem>
                            <SidebarSubItem active={router.pathname?.startsWith("/primary/islands")} href='/primary/islands'>
                                Islands
                            </SidebarSubItem>
                        </Fragment>
                    }>
                        Primary Election
                    </SidebarItem> */}
                </div>
                {
                    (user?.role === "editors" || user?.role === "admins") && 
                    <SidebarItem href='/users' active={router.pathname?.startsWith("/users")} icon={<UserGroupIcon className='w-5 h-5' />}>
                        Users
                    </SidebarItem>
                }
                <SidebarItem href='/help' active={router.pathname?.startsWith("/help")} icon={<InformationCircleIcon className='w-5 h-5' />}>Help</SidebarItem>
                <SidebarItem href='/settings' active={router.pathname?.startsWith("/settings")} icon={<Cog8ToothIcon className='w-5 h-5' />}>Settings</SidebarItem>
            </Sidebar>
            <section className='flex-1 lg:max-w-[calc(100vw-20rem)]'>
                <Header state={[sidebarActive, setSidebarActive]} pendingArticles={props?.pendingArticles} />
                {props.children}
            </section>
        </main>
    )
}

export default DashboardLayout