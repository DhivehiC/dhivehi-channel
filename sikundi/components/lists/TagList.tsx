import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from '../Heading'

interface Props {
    tags?: any
}

const TagList:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary py-4 rounded-lg w-full overflow-x-auto mb-4'
    ])
    const router = useRouter()

    return (
        <div className={styles}>
            <Heading level={20} className="text-accent font-light px-4 mb-6">All Tags</Heading>
            <table className='w-full'>
                <thead className='bg-background text-secondary'>
                    <tr>
                        <th className='text-start px-4'>Title</th>
                        <th className='text-start px-4'>No. of Articles</th>
                        <th className='text-start px-4'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.tags?.length > 0 ?
                        props.tags?.map((item:any, index:any)=>{
                            return (
                                <tr className='text-accent hover:opacity-50 cursor-pointer' key={index} onClick={()=>router.push(`/articles/tags/${item?.id}/update`)}>
                                    <td className='p-4'>{item?.title}</td>
                                    <td className='p-4'>{item?._count?.post_tags}</td>
                                    <td className={twMerge([
                                        'p-4',
                                        item?.published_at && "text-success",
                                        item?.deleted_at && "text-danger"
                                    ])}>
                                        {item?.published_at ? (new Date(item?.published_at ) > new Date() ? "scheduled for publish" : "published") : item?.deleted_at ? "deleted" : "drafted"}
                                    </td>
                                </tr>
                            )
                        }) :
                        <tr>
                            <td className="text-center p-4 text-accent font-bold" colSpan={3}>no Tags at the moment</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TagList