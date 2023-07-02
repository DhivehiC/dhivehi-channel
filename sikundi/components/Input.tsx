import OmmitProps from '@sikundi/hooks/ommitProp'
import React, { forwardRef, Fragment, InputHTMLAttributes, useEffect, useImperativeHandle, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    errors?: string[]
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        'bg-background text-white',
        'p-2 rounded-md w-full mb-3',
        'focus-within:outline-none border-2 border-transparent focus-within:border-primary',
        props.className && props.className,
        props.errors && 'mb-0',
    ])
    const radioStyles = twMerge([
        ''
    ])

    if (props.type === "radio") {
        return (
            <Fragment>
                <input {...OmmitProps(['errors'],props)} className={radioStyles} ref={localRef} />
                {typeof props.errors === 'object' && <ul className='mb-3'>
                    {
                        props.errors?.map((error, index)=>(
                            <li key={index} className='text-primary mb-2 font-semibold'>{error}</li>
                        ))
                    }
                </ul>}
                {
                    typeof props.errors === 'string' && 
                    <p className='text-primary mb-2 font-semibold'>{props.errors}</p>
                }
            </Fragment>
        )
    }

    if (props.type === "checkbox") {
        return (
            <Fragment>
                <input {...OmmitProps(['errors'],props)} className={radioStyles} ref={localRef} />
                {typeof props.errors === 'object' && <ul className='mb-3'>
                    {
                        props.errors?.map((error, index)=>(
                            <li key={index} className='text-primary mb-2 font-semibold'>{error}</li>
                        ))
                    }
                </ul>}
                {
                    typeof props.errors === 'string' && 
                    <p className='text-primary mb-2 font-semibold'>{props.errors}</p>
                }
            </Fragment>
        )
    }
    return (
        <Fragment>
            <input {...OmmitProps(['errors'],props)} className={styles} ref={localRef} />
            {typeof props.errors === 'object' && <ul className='mb-3'>
                {
                    props.errors?.map((error, index)=>(
                        <li key={index} className='text-primary mb-2 font-semibold'>{error}</li>
                    ))
                }
            </ul>}
            {
                typeof props.errors === 'string' && 
                <p className='text-primary mb-2 font-semibold'>{props.errors}</p>
            }
        </Fragment>
    )
})

Input.displayName = 'Input'

export default Input