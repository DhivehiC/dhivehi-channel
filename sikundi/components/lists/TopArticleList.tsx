import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from '../Heading'

interface Props {
    articles?:any
}

const TopArticleList:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary py-4 rounded-lg w-full overflow-x-auto mb-4'
    ])
    const router = useRouter()

    return (
        <div className={styles}>
            <div className='flex flex-wrap items-center px-4 mb-6'>
                <Heading level={20} className="text-accent font-light md:mb-0 mr-auto mb-3">Top Articles</Heading>
            </div>
            <table className='w-full'>
                <thead className='bg-background text-secondary'>
                    <tr>
                        <th className='text-start px-4'>Title</th>
                        <th className='text-start px-4'>Views</th>
                        <th className='text-start px-4'>Author</th>
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

export default TopArticleList