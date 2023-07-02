import React, { forwardRef, Fragment, SelectHTMLAttributes, useImperativeHandle, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    
}

const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        'bg-background text-accent p-2 rounded-md',
        props.className && props.className
    ])

    return (
        <select {...props} className={styles} ref={localRef}>

        </select>
    )
})

Select.displayName = 'Select'

export default Select