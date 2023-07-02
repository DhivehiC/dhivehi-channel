import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from '../Heading'
import Select from '../Select'
import dayjs from 'dayjs'

interface Props {
    articles?:any
    period?: string
}

const ArticleList:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary py-4 rounded-lg w-full overflow-x-auto mb-4'
    ])
    const router = useRouter()

    return (
        <div className={styles}>
            <div className='flex flex-wrap items-center px-4 mb-6'>
                <Heading level={20} className="text-accent font-light md:mb-0 mr-auto mb-3">All Users</Heading>
                <Select className='px-3 w-full md:w-[unset]' value={router.query?.filterby || 'all'} onChange={(e)=>{
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
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                    <option value="writers">Writers</option>
                    <option value="editors">Editors</option>
                    <option value="admins">Admins</option>
                </Select>
            </div>
            <table className='w-full'>
                <thead className='bg-background text-secondary'>
                    <tr>
                        <th className='text-start px-4'>email</th>
                        <th className='text-start px-4'>status</th>
                        <th className='text-start px-4'>{`post count (${props.period})`}</th>
                        <th className='text-start px-4'>created_at</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.articles?.length > 0 ?
                        props.articles?.map((item:any, index:any)=>{
                            return (
                                <tr className='text-accent hover:opacity-50 cursor-pointer' key={index} onClick={()=>router.push(`/users/${item?.id}/update`)}>
                                    <td className='p-4'>{item?.email}</td>
                                    <td className={twMerge([
                                        'p-4',
                                        item?.status === "active" ? "text-success" : "text-danger",
                                    ])}>
                                        {item?.status}
                                    </td>
                                    <td className='p-4'>{item?._count?.posts_created}</td>
                                    <td className='p-4'>{dayjs(item?.created_at).format('MMM D, YYYY')}</td>
                                </tr>
                            )
                        }) :
                        <tr>
                            <td className="text-center p-4 text-accent font-bold" colSpan={3}>no users at the moment</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ArticleList