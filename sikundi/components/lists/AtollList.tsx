import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from '../Heading'
import dayjs from 'dayjs'

interface Props {
    atolls?: any
}

const AtollList:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary py-4 rounded-lg w-full overflow-x-auto'
    ])
    const router = useRouter()

    return (
        <div className={styles}>
            <Heading level={20} className="text-accent font-light px-4 mb-6">All Atolls</Heading>
            <table className='w-full'>
                <thead className='bg-background text-secondary'>
                    <tr>
                        <th className='text-start px-4'>Name</th>
                        <th className='text-start px-4'>No. of Islands</th>
                        <th className='text-start px-4'>Created At</th>
                    </tr>
                </thead>
                <tbody>
                        {
                            props.atolls?.length > 0 ?
                            props.atolls?.map((item:any, index:any)=>{
                                return (
                                    <tr className='text-accent hover:opacity-50 cursor-pointer' key={index} onClick={()=>router.push(`/primary/atolls/${item?.id}/update`)}>
                                        <td className='p-4'>{item?.name}</td>
                                        <td className='p-4'>{item?._count?.islands}</td>
                                        <td className='p-4'>{dayjs(item?.created_at).format('MMM DD, YYYY - HH:mm')}</td>
                                    </tr>
                                )
                            }) :
                            <tr>
                                <td className="text-center p-4 text-accent font-bold" colSpan={3}>no Atolls at the moment</td>
                            </tr>
                        }
                </tbody>
            </table>
        </div>
    )
}

export default AtollList