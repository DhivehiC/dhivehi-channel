import React, { FC, Fragment } from 'react'
import CommentCard from '@DhivehiChannel/components/cards/CommentCard'
import { twMerge } from 'tailwind-merge'


interface Props {
    className?: string
    comments: Comments[],
}

interface Comments {
    id: Number,
    created_by: String,
    content: String,
    notApproved?: Boolean
}

const CommentGroup:FC<Props> = (props) => {
    return (
        <Fragment>
            {
                props.comments?.map((comment, index: number)=>(
                    <CommentCard className={twMerge([
                        'col-span-12 lg:col-span-3',
                        props.className
                    ])} key={index} data={{
                        createdBy: comment.created_by,
                        content: comment.content,
                        notApproved: comment.notApproved,
                    }} />
                ))
            }
        </Fragment>
    )
}

export default CommentGroup