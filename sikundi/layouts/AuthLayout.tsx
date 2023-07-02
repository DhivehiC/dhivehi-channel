import React, { FC, Fragment, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
    children?: ReactNode
}

const AuthLayout:FC<Props> = (props) => {
    return (
        <main className={twMerge([
            'min-h-screen w-screen',
            'bg-background',
            'flex items-center justify-center p-4'
        ])}>
            {props.children}
        </main>
    )
}

export default AuthLayout