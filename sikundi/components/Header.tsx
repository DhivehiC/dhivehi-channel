import React, { FC, useEffect, useState } from 'react'
import DropDown from './DropDown'
import Heading from './Heading'
import BellIcon from '@heroicons/react/24/solid/BellIcon'
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon'
import UserCircleIcon from '@heroicons/react/24/solid/UserCircleIcon'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon'
import Image from 'next/image'
import logo from '../public/image/brain.png'
import Button from './Button'
import { useReadLocalStorage } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { useInterval } from 'usehooks-ts'
import Link from 'next/link'

interface Props {
    state?: any
    pendingArticles?: any
}

const Header:FC<Props> = (props) => {
    const [sidebarActive, setSidebarActive] = props.state
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const usr:any = useReadLocalStorage('user')
    const [user, setUser] = useState<any>({})
    const [notifications, setNotifications] = useState<any>({})

    useInterval(() => {
        Notifications()
    }, 1000*60*5)

    useEffect(()=>{
        Notifications()
        setUser(usr)
    }, [])

    function logout() {
        setLoading(true)
        fetch('/api/auth/sign-out', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }).then((res)=>{
            router.replace('/?logout=true')
        }).catch((e)=>{

        }).finally(()=>{
            setLoading(false)
        })
    }

    function Notifications() {
        fetch('/api/notifications', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(async (res)=>{
            if (res.status === 200) {
                setNotifications(await res.json())
            } else {
                setNotifications({})
            }
        }).catch((e)=>{

        })
    }

    return (
        <header className='p-4 flex container mx-auto items-center flex-col-reverse lg:flex-row'>
            <div className='flex-1 mb-6 lg:mb-0'>
                <Heading level={20} className={'text-quaternary'}>Hello, {user?.first_name} {user?.last_name}</Heading>
                <Heading level={14} className={'text-[#656878]'}>Have a nice day</Heading>
            </div>
            <div className='flex items-center gap-3 w-full justify-end lg:w-[unset] mb-4 lg:mb-0'>
                <div className='w-full lg:hidden'>
                    <Image src={logo} alt={'logo'} className={'w-9'} />
                </div>
                <DropDown head={<BellIcon className={twMerge(['text-quaternary h-6 w-6', (notifications.pendingArticles > 0 || notifications?.pendingComments > 0) && 'text-primary animate-pulse'])} />}>
                    {(!notifications?.pendingArticles && !notifications?.pendingComments) && <Heading level={14} className="text-quaternary">No Notifications at the moment</Heading>}
                    {(notifications?.pendingArticles > 0) && <Link href={"/articles?filterby=draft"}><Heading level={14} className="text-quaternary bg-background p-2 rounded-md hover:opacity-70 active:opacity-50">You have some articles which needs to be published. click here to publish!</Heading></Link>}
                </DropDown>
                <DropDown head={
                    <div className='border-l-white lg:border-l lg:pl-4 flex items-center gap-3'>
                        <UserCircleIcon className='h-7 w-7 text-white' />
                        <Heading level={14} className="text-quaternary hidden lg:block">{user?.last_name}</Heading>
                        <ChevronDownIcon className='h-4 w-4 text-white hidden lg:block' />
                    </div>
                }>
                    <div className='w-full flex flex-col items-center justify-center'>
                        <UserCircleIcon className='h-14 w-14 text-white' />
                        <Heading level={14} className="text-quaternary mb-4">{user?.first_name} {user?.last_name}</Heading>
                        <Button className='w-full'>User Settings</Button>
                        <Button className='mb-0 flex items-center justify-center w-full' onClick={logout} loading={loading}>Log Out</Button>
                    </div>
                </DropDown>
                <button className='hover:opacity-70 active:opacity-50 lg:hidden' onClick={()=>setSidebarActive(!sidebarActive)}><Bars3Icon className='text-quaternary h-6 w-6' /></button>
            </div>
        </header>
    )
}

export default Header