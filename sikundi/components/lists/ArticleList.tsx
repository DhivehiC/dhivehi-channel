import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from '../Heading'
import Select from '../Select'
import dayjs from 'dayjs'

interface Props {
    articles?:any
    postCounts?:any
    className?: string
}

const ArticleList:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary py-4 rounded-lg w-full overflow-x-auto mb-4',
        props?.className && props?.className
    ])
    const router = useRouter()

    return (
        <div className={styles}>
            <div className='flex flex-wrap items-center px-4 mb-6'>
                <Heading level={20} className="text-accent font-light md:mb-0 mr-auto mb-3">All Articles</Heading>
                <Select className='px-3 w-full md:w-[unset]' value={router.query?.filterby} onChange={(e)=>{
                    if (e.target.value === "all") {
                        router.push(`${router.pathname}?query=${String(router.query['query'] || "")}`)
                    } else {
                        router.replace({
                            query: {
                                ...router.query,
                                filterby: e.target.value
                            }
                        })
                    }
                }}>
                    <option value="all">All ({props?.postCounts?.published+props?.postCounts?.draft+props?.postCounts?.deleted || 0})</option>
                    <option value="mine">Mine ({props?.postCounts?.mine || 0})</option>
                    <option value="draft">Draft ({props?.postCounts?.draft || 0})</option>
                    <option value="published">Published ({props?.postCounts?.published|| 0})</option>
                    <option value="deleted">Deleted ({props?.postCounts?.deleted || 0})</option>
                </Select>
            </div>
            <table className='w-full'>
                <thead className='bg-background text-secondary'>
                    <tr>
                        <th className='text-start px-4'>Title</th>
                        <th className='text-start px-4'>Views</th>
                        <th className='text-start px-4'>Author</th>
                        <th className='text-start px-4'>status</th>
                        <th className='text-start px-4'>published_at</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.articles?.length > 0 ?
                        props.articles?.map((item:any, index:any)=>{
                            return (
                                <tr className='text-accent hover:opacity-50 cursor-pointer' key={index} onClick={()=>router.push(`/articles/${item?.id}/update`)}>
                                    <td className='p-4'>{item?.title}</td>
                                    <td className='p-4'>{item?.total_view_count}</td>
                                    <td className='p-4'>{item?.created_by?.user_name}</td>
                                    <td className={twMerge([
                                        'p-4',
                                        item?.published_at && "text-success",
                                        item?.deleted_at && "text-danger"
                                    ])}>
                                        {item?.published_at ? (new Date(item?.published_at ) > new Date() ? "scheduled for publish" : "published") : item?.deleted_at ? "deleted" : "drafted"}
                                    </td>
                                    <td className='p-4'>{item?.published_at ? dayjs(item?.published_at).format('MMM DD, YYYY - HH:mm') : "-"}</td>
                                </tr>
                            )
                        }) :
                        <tr>
                            <td className="text-center p-4 text-accent font-bold" colSpan={3}>no Articles at the moment</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ArticleList