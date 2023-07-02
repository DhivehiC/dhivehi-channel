import React, { FC, Fragment } from 'react'

interface Props {
    
}

const Table:FC<Props> = (props) => {
    return (
        <div className=' overflow-x-scroll relative'>
            <table className='w-full'>
                <thead className='bg-background'>
                    <tr>
                        <th className='text-start text-[#656878] px-4'>Headline</th>
                        <th className='text-start text-[#656878] px-4'>Author</th>
                        <th className='text-start text-[#656878] px-4'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='text-accent px-4'>asdasdads</td>
                        <td className='text-accent px-4'>adasdasds</td>
                        <td className='text-accent px-4'>adasdasds</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table