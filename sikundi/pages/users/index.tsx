import UserList from '@sikundi/components/lists/UserList'
import Button from '@sikundi/components/Button'
import Container from '@sikundi/components/Container'
import InfoBox from '@sikundi/components/InfoBox'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement, useState } from 'react'
import type { NextPageWithLayout } from '../_app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { prisma } from '@sikundi/libs/server/prisma'
import Paginate from '@sikundi/components/Paginate'
import { jwtVerify } from 'jose'

interface Props {
    users: any
    totalPages: any
    current: any
    period: string
}

const Page: NextPageWithLayout<Props> = (props) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    return (
        <Fragment>
            <Container className='grid grid-cols-1 py-5'>
                <div className='flex flex-col items-end order-1 xl:order-2'>
                    {
                        props.totalPages > 1 &&
                        <Paginate url={'/users?page='} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset] lg:hidden" />
                    }
                    <Button className='bg-secondary px-5 mb-5 ml-auto block' loading={loading} onClick={()=>router.push('/users/create')}>New User</Button>
                    <UserList articles={props.users} period={props.period} />
                    {
                        props.totalPages > 1 &&
                        <Paginate url={'/users?page='} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset]" />
                    }
                </div>
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Users | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const current = ctx.query.page || 0
    const filter_by = ctx.query.filterby
    const per_page = 12

    let filters = {}
    if (filter_by === "admins") {
        filters = {...filters, 
            role: "admins"
        }
    }
    if (filter_by === "editors") {
        filters = {...filters, 
            role: "editors"
        }
    }
    if (filter_by === "writers") {
        filters = {...filters, 
            role: "writers"
        }
    }
    if (filter_by === "active") {
        filters = {...filters, 
            status: "active"
        }
    }
    if (filter_by === "banned") {
        filters = {...filters, 
            status: "banned"
        }
    }
    // if (filter_by === "draft") {
    //     filters = {...filters, 
    //         published_at: {
    //             equals: null
    //         }
    //     }
    // }
    // if (filter_by === "deleted") {
    //     filters = {...filters, 
    //         deleted_at: {
    //             not: null
    //         }
    //     }
    // }
    // if (filter_by === "deleted") {
    //     filters = {...filters, 
    //         deleted_at: {
    //             not: null
    //         }
    //     }
    // }
    // if (filter_by === "mine") {
    //     const token = ctx.req.cookies['token']
    //     const secret = process.env.ACCESS_TOKEN_SECRET
    //     const {payload} = await jwtVerify(String(token), new TextEncoder().encode(secret))
    //     filters = {...filters, 
    //         created_by: {
    //             id: payload.id
    //         }
    //     }
    // }

    const [firstDay, lastDay] = getFirstAndLastDateOfCurrentMonth()

    const users = await prisma.users.findMany({
        select: {
            id: true,
            email: true,
            status: true,
            created_at: true,
            _count: {
                select: {
                    posts_created: {
                        where: {
                            published_at: {
                                gte: firstDay.toISOString(),
                                lte: lastDay.toISOString()
                            }
                        }
                    }
                },
            }
        },
        where: filters,
        orderBy: {
            created_at: 'desc'
        },
        take: per_page,
        skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
    })
    const totalUsers = await prisma.users.aggregate({
        _count: true,
        where: filters
    })

    if (users.length === 0 && ctx.query.page !== undefined) {
        return {
            props: {

            },
            redirect: {
                destination: '/articles',
                permanent: false
            }
        }
    }
    
    return {
        props: {
            users: JSON.parse(JSON.stringify(users)),
            totalPages: Math.ceil((Number(totalUsers._count)/per_page)),
            current: current === 0 ? 1 : current,
            period: `${firstDay.toDateString()} to ${lastDay.toDateString()}`
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