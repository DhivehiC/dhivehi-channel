import OmmitProps from '@sikundi/hooks/ommitProp'
import React, { forwardRef, Fragment, TextareaHTMLAttributes, useImperativeHandle, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    errors?: string[]
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        'bg-background text-white',
        'p-2 rounded-md w-full mb-2',
        'focus-within:outline-none border-2 border-transparent focus-within:border-primary',
        props.className && props.className,
        props.errors && 'mb-0',
    ])

    return (
        <Fragment>
            <textarea {...OmmitProps([''], props)} ref={localRef} className={styles}></textarea>
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

TextArea.displayName = 'TextArea'

export default TextArea