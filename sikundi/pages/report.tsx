import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'

interface Props {
    report: any
}

const Page: NextPageWithLayout<Props> = (props) => {

    return (
        <Fragment>
            <table className='bg-white w-full'>
                <tr className='border border-black'>
                    <th className='border border-black'>email</th>
                    <th className='border border-black'>first name</th>
                    <th className='border border-black'>last name</th>
                    <th className='border border-black'>post count</th>
                    <th className='border border-black'>date</th>
                </tr>
                {
                    props?.report?.map((row:any, index:any)=>(
                        <tr key={index}>
                            <td className='border border-black'>{row.email}</td>
                            <td className='border border-black'>{row.first_name}</td>
                            <td className='border border-black'>{row.last_name}</td>
                            <td className='border border-black'>{row._count.posts_created}</td>
                            <td className='border border-black'>{row.date}</td>
                        </tr>
                    ))
                }
            </table>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Report | sikundi</title>
            </Head>
            {page}
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const [startDate, endDate] = getFirstAndLastDateOfCurrentMonth()

    const currentDate = new Date(startDate);

    let report:any = []
    while (currentDate <= endDate) {
        const start = new Date(new Date(currentDate).setHours(0, 0, 0, 0))
        const end = new Date(new Date(currentDate).setHours(23, 59, 59, 999))

        let logs = await prisma?.users.findMany({
            select: {
                email: true,
                first_name: true,
                last_name: true,
                _count: {
                    select: {
                        posts_created: {
                            where: {
                                published_at: {
                                    gte: start,
                                    lte: end
                                }
                            }
                        }
                    }
                }
            }
        })
        
        const final:any = logs?.map((log)=>(
            {...log, date: start.toDateString()}
        ))

        report = [...report, ...final].sort((a, b) => {
            const nameA = a.email.toLowerCase();
            const nameB = b.email.toLowerCase();
            
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            
            return 0;
        })
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        props: {
            report
        }
    }
}

export default Page


function getFirstAndLastDateOfCurrentMonth() {
    const currentDate = new Date()
    currentDate.setDate(1)

    const firstDayOfCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    )

    const lastDayOfCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    )

    return [firstDayOfCurrentMonth, lastDayOfCurrentMonth]
}