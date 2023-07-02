import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import Heading from '../Heading'

interface Props {
    boxes?: any
}

const BoxList:FC<Props> = (props) => {
    const styles = twMerge([
        'bg-secondary py-4 rounded-lg w-full overflow-x-auto mb-4'
    ])
    const router = useRouter()

    return (
        <div className={styles}>
            <Heading level={20} className="text-accent font-light px-4 mb-6">All Vote Boxes</Heading>
            <table className='w-full'>
                <thead className='bg-background text-secondary'>
                    <tr>
                        <th className='text-start px-4'>box Id</th>
                        <th className='text-start px-4'>Name</th>
                        <th className='text-start px-4'>Island</th>
                        <th className='text-start px-4'>ibu</th>
                        <th className='text-start px-4'>anni</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.boxes?.length > 0 ?
                        props.boxes?.map((item:any, index:any)=>{
                            return (
                                <tr className='text-accent hover:opacity-50 cursor-pointer' key={index} onClick={()=>router.push(`/primary/${item?.id}/update`)}>
                                    <td className='p-4'>{item?.box_number}</td>
                                    <td className='p-4'>{item?.name}</td>
                                    <td className='p-4'>{item?.island?.name}</td>
                                    <td className='p-4'>{item?.ibu}</td>
                                    <td className='p-4'>{item?.anni}</td>
                                </tr>
                            )
                        }) :
                        <tr>
                            <td className="text-center p-4 text-accent font-bold" colSpan={5}>no Boxes at the moment</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default BoxList