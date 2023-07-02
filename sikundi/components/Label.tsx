import OmmitProps from '@sikundi/hooks/ommitProp'
import React, { forwardRef, Fragment, LabelHTMLAttributes, useImperativeHandle, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
    
}

const Label = forwardRef<HTMLLabelElement, Props>((props, ref) => {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        'text-accent font-medium text-base mb-2 block',
        props.className && props.className
    ])

    return (
        <label {...OmmitProps([''], props)} className={styles} ref={localRef}></label>
    )
})

Label.displayName = 'Label'

export default Label