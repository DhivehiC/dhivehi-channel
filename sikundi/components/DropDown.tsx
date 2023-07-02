import { useRouter } from 'next/router'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useOnClickOutside } from 'usehooks-ts'

interface Props {
    head?: ReactNode,
    children?: ReactNode,
    className?: string,
    btnClassName?: string,
    disabled?: boolean
}

const DropDown:FC<Props> = (props) => {
    const [active, setActive] = useState(false)
    const ref = useRef(null)
    const router = useRouter()

    const handleRouteChange = () => {
        setActive(false)
    }

    useEffect(()=>{
        router.events.on('routeChangeStart', handleRouteChange)
        return () => {
          router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [])

    const handleClickOutside = () => {
        setActive(false)
    }

    const style = twMerge([
        'bg-secondary p-4 rounded-lg shadow-xl fixed lg:absolute z-30 border-background border',
        'lg:right-0 lg:left-[unset] lg:bottom-[unset] lg:top-[120%] lg:min-w-[350px]',
        'bottom-0 left-0 w-full invisible',
        active && 'visible',
        props.className && props.className
    ])

    const styleBtn = twMerge([
        'flex flex-col items-center justify-center',
        props.disabled ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-70 active:opacity-50',
        props.btnClassName && props.btnClassName
    ])
  
    useOnClickOutside(ref, handleClickOutside)

    return (
        <div className='lg:relative'>
            <button className={styleBtn} type={'button'} onClick={()=>setActive(!active)} disabled={props.disabled}>{props.head}</button>
            <div ref={ref} className={style}>
                {props.children}
            </div>
        </div>
    )
}

export default DropDown