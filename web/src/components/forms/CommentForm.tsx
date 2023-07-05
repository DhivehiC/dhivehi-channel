import React, { FC, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import transliterate from '@DhivehiChannel/libs/transliterate'
import axios from 'axios'

interface Props {
    className?: string
    apiKey: string
    apiUrl: string
    OnSucess: Function
}

type FormData = {
    name: string;
    comment: string;
};

const CommentForm:FC<Props> = (props) => {
    const className = twMerge([
        'bg-[#f2f2f2] lg:p-10 p-8',
        props?.className
    ])
    const [name, setName] = useState("")
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    function submit() {
        return new Promise(async (resolve, reject)=>{
            try {
                const { data, status } = await axios.post(props.apiUrl, {
                    name,
                    content
                },
                {
                    headers: {
                        authorization: `Bearer ${props.apiKey}`
                    }
                })
                if (status === 200) {
                    props.OnSucess(data)
                    setName("")
                    setContent("")
                    return resolve(data)
                }
                return reject("")
            } catch (error) {
                return reject("")
            }
        })
    }    

    return (
        <form className={className} onSubmit={async (e)=>{
            e.preventDefault()
            await submit()
        }}>
            <input 
                className='block w-full bg-white p-3 mb-4 focus-within:outline-primary'
                placeholder='ނަން'
                value={name}
                onChange={(e)=>{
                    setName(transliterate(e.currentTarget.value))
                }}
            />
            <textarea 
                className='block w-full bg-white p-3 mb-4 focus-within:outline-primary'
                rows={10}
                placeholder='މެސެޖް'
                value={content}
                onChange={(e)=>{
                    setContent(transliterate(e.currentTarget.value))
                }}
                onKeyDown={async (event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        await submit()
                    }
                    else if (event.key === "Enter" && event.shiftKey) {
                        setContent(`${content}\n`)
                    }
                }}
            />
            <button type="submit" className='bg-white p-3 text-primary hover:bg-primary hover:text-white active:opacity-50' disabled={isSubmitting}>
                {isSubmitting ? 
                <svg className="animate-spin -ml-1 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                : "ފޮނުވާ"}
            </button>
        </form>
    )
}

export default CommentForm