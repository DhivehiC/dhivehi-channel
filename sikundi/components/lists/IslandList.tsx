import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from '../Heading'

interface Props {
    islands?: any
}

const TagList:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary py-4 rounded-lg w-full overflow-x-auto mb-4'
    ])
    const router = useRouter()

    return (
        <div className={styles}>
            <Heading level={20} className="text-accent font-light px-4 mb-6">All Islands</Heading>
            <table className='w-full'>
                <thead className='bg-background text-secondary'>
                    <tr>
                        <th className='text-start px-4'>Name</th>
                        <th className='text-start px-4'>atoll</th>
                        <th className='text-start px-4'>No. of Vote Boxes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.islands?.length > 0 ?
                        props.islands?.map((item:any, index:any)=>{
                            return (
                                <tr className='text-accent hover:opacity-50 cursor-pointer' key={index} onClick={()=>router.push(`/primary/islands/${item?.id}/update`)}>
                                    <td className='p-4'>{item?.name}</td>
                                    <td className='p-4'>{item?.atoll?.name}</td>
                                    <td className='p-4'>{item?._count?.boxes}</td>
                                </tr>
                            )
                        }) :
                        <tr>
                            <td className="text-center p-4 text-accent font-bold" colSpan={3}>no Islands at the moment</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TagList