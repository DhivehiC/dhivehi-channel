import OmmitProps from '@sikundi/hooks/ommitProp'
import Link from 'next/link'
import React, { AnchorHTMLAttributes, forwardRef, Fragment, ReactNode, useImperativeHandle, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: ReactNode,
    active?: boolean,
    subItems?: ReactNode
}

const SidebarItem = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        'flex items-center gap-5 text-base font-bold text-quaternary p-4 hover:opacity-50 active:opacity-30',
        props.active && 'border-r-primary border-r-[6px] text-[#D4D4D480]',
        props.className && props.className
    ])

    return (
        <Fragment>
            <Link {...OmmitProps(['icon', 'active', 'subItems'], props)} className={styles}>
                {props.icon && props.icon}
                {props.children && props.children}
            </Link>
            {(props.subItems && props.active) &&<div className='ml-12'>
                {props.subItems}
            </div>}
        </Fragment>
    )
})

SidebarItem.displayName = 'SidebarItem'

export default SidebarItem