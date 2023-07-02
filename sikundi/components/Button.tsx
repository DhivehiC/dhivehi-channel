import OmmitProps from '@sikundi/hooks/ommitProp'
import React, { ButtonHTMLAttributes, forwardRef, Fragment, useImperativeHandle, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        'text-white bg-background p-2 rounded-md mb-2 font-bold',
        props.disabled ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-70 active:opacity-50',
        props.className && props.className
    ])

    return (
        <button {...OmmitProps(['loading'], props)} className={styles} disabled={props.loading}>
            {
                props.loading ?
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> :
                props.children
            }
        </button>
    )
})

Button.displayName = 'Button'

export default Button