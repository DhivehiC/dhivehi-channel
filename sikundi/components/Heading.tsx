import OmmitProps from '@sikundi/hooks/ommitProp'
import React, { forwardRef, Fragment, HTMLAttributes, useImperativeHandle, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends HTMLAttributes<HTMLHeadingElement> {
    level: 12 | 14 | 16 | 18 | 20 | 24 | 30 | 36 | 48 | 60 | 72 | 96 | 128
}

const Heading = forwardRef<HTMLHeadingElement, Props>((props, ref) => {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        props.level == 12 && 'text-xs',
        props.level == 14 && 'text-sm',
        props.level == 16 && 'text-base',
        props.level == 18 && 'text-lg',
        props.level == 20 && 'text-xl',
        props.level == 24 && 'text-2xl',
        props.level == 30 && 'text-3xl',
        props.level == 36 && 'text-4xl',
        props.level == 48 && 'text-5xl',
        props.level == 60 && 'text-6xl',
        props.level == 72 && 'text-7xl',
        props.level == 96 && 'text-8xl',
        props.level == 128 && 'text-9xl',
        'font-bold',
        props.className && props.className
    ])

    if (props.level==12 || props.level==14) {
        return (
            <h6 {...OmmitProps(['level'], props)} className={styles}></h6>
        )
    }

    if (props.level==16 || props.level==18) {
        return (
            <h5 {...OmmitProps(['level'], props)} className={styles}></h5>
        )
    }

    if (props.level==20 || props.level==24) {
        return (
            <h4 {...OmmitProps(['level'], props)} className={styles}></h4>
        )
    }

    if (props.level==30 || props.level==36) {
        return (
            <h3 {...OmmitProps(['level'], props)} className={styles}></h3>
        )
    }

    if (props.level==48 || props.level==60) {
        return (
            <h2 {...OmmitProps(['level'], props)} className={styles}></h2>
        )
    }

    if (props.level==72 || props.level==96 || props.level==128) {
        return (
            <h1 {...OmmitProps(['level'], props)} className={styles}></h1>
        )
    }
    
    return null
})

Heading.displayName = 'Heading'

export default Heading