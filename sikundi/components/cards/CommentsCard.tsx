import React, { FC, useState } from 'react'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import Heading from '@sikundi/components/Heading'
import Button from '@sikundi/components/Button'

interface Props {
    created_by?: string
    content?: string
    post_id?: number
    id?: number
    approve: Function
    disapprove: Function
}

const CommentsCard:FC<Props> = (props) => {
    const [approve, setApprove] = useState(false)
    const [disApprove, setDisApprove] = useState(false)
    return (
        <div className='w-full py-3 px-4 bg-secondary rounded-md mb-3 flex items-center gap-2' dir='rtl'>
            <div className='grow shrink basis-0'>
                <Heading level={24} className="text-primary mb-3">{props.created_by}</Heading>
                <Heading level={16} className="text-accent">{props.content}</Heading>
            </div>
            <Button loading={disApprove} className='bg-danger' onClick={async ()=>{
                setDisApprove(true)
                await props.disapprove()
                setDisApprove(false)
            }}>
                <XCircleIcon className='h-6 w-6 text-white' />
            </Button>
            <Button loading={approve} className='bg-success' onClick={async ()=>{
                setApprove(true)
                await props.approve()
                setApprove(false)
            }}>
                <CheckCircleIcon className='h-6 w-6 text-white' />
            </Button>
        </div>
    )
}

export default CommentsCard