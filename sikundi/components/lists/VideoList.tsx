import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from '../Heading'
import Select from '../Select'

interface Props {
    articles?:any
}

const VideoList:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary py-4 rounded-lg w-full overflow-x-auto mb-4'
    ])
    const router = useRouter()

    return (
        <div className={styles}>
            <div className='flex flex-wrap items-center px-4 mb-6'>
                <Heading level={20} className="text-accent font-light md:mb-0 mr-auto mb-3">All Videos</Heading>
                <Select className='px-3 w-full md:w-[unset]' value={router.query?.filterby} onChange={(e)=>{
                    if (e.target.value === "all") {
                        router.push(router.pathname)
                    } else {
                        router.replace({
                            query: {
                                ...router.query,
                                filterby: e.target.value
                            }
                        })
                    }
                }}>
                    <option value="all">All</option>
                    <option value="mine">Mine</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="deleted">Deleted</option>
                </Select>
            </div>
            <table className='w-full'>
                <thead className='bg-background text-secondary'>
                    <tr>
                        <th className='text-start px-4'>Title</th>
                        <th className='text-start px-4'>Author</th>
                        <th className='text-start px-4'>status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.articles?.length > 0 ?
                        props.articles?.map((item:any, index:any)=>{
                            return (
                                <tr className='text-accent hover:opacity-50 cursor-pointer' key={index} onClick={()=>router.push(`/videos/${item?.id}/update`)}>
                                    <td className='p-4'>{item?.title}</td>
                                    <td className='p-4'>{item?.created_by?.user_name}</td>
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
                            <td className="text-center p-4 text-accent font-bold" colSpan={3}>no Videos at the moment</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default VideoList