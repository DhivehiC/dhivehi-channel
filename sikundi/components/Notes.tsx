import React, { FC, Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import Heading from './Heading'

interface Props {
    className?: string
    rows?: number
}

const Notes:FC<Props> = (props) => {
    const cacheNotes:any = useReadLocalStorage('notes')
    const [notes, setNotes] = useLocalStorage('notes', cacheNotes)

    const styles = twMerge([
        'bg-secondary w-full p-5 rounded-lg',
        props.className && props.className
    ])
    return (
        <div className={styles}>
            <Heading level={24} className="text-accent font-light mb-7">Notes</Heading>
            <textarea
                className={'w-full bg-background rounded-lg p-4 text-accent focus-within:outline-none focus-within:border focus-within:border-primary'}
                value={notes || ""} onChange={(res)=>setNotes(res.target.value)}
                rows={props?.rows}
            />
        </div>
    )
}

export default Notes