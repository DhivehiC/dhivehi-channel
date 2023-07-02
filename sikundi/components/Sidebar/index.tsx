import Image from 'next/image'
import React, { FC, Fragment, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import logo from '../../public/image/brain.png'
import Heading from '../Heading'

interface Props {
    children?: ReactNode
    state?: any
}

const index:FC<Props> = (props) => {
    const [sidebarActive, setSidebarActive] = props.state
    
    return (
        <Fragment>
            <aside className={twMerge([
                'bg-secondary z-40 shadow-lg',
                'h-screen w-10/12 max-w-xs transition-all overflow-y-auto',
                `absolute ${sidebarActive ? 'left-0' : '-left-full'}`,
                'lg:sticky top-0'
            ])}>
                <div className={'flex flex-wrap items-end mb-6 p-2'}>
                    <Image src={logo} alt={'logo'} className={'w-28'} priority />
                    <Heading level={30} className="text-center text-primary">Sikundi.io</Heading>
                </div>
                {props.children}
            </aside>
            {
                sidebarActive && 
                <span className='absolute inset-0 bg-[#00000080] z-30 lg:hidden' onClick={()=>setSidebarActive(false)} />
            }
        </Fragment>
    )
}

export default index