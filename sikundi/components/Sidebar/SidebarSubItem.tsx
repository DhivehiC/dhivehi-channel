import OmmitProps from '@sikundi/hooks/ommitProp'
import Link from 'next/link'
import React, { AnchorHTMLAttributes, forwardRef, Fragment, ReactNode, useImperativeHandle, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    active?: boolean
}

const SidebarItem = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        'text-base font-bold text-quaternary p-2 hover:opacity-50 active:opacity-30 block',
        props.active && 'text-primary',
        props.className && props.className
    ])

    return (
        <Link {...OmmitProps(['active'], props)} className={styles}>
            {props.children && props.children}
        </Link>
    )
})

SidebarItem.displayName = 'SidebarItem'

export default SidebarItem