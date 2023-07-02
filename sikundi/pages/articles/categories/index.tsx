import Button from '@sikundi/components/Button'
import Container from '@sikundi/components/Container'
import InfoBox from '@sikundi/components/InfoBox'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement, useState } from 'react'
import type { NextPageWithLayout } from '../../_app'
import CategoryList from '@sikundi/components/lists/CategoryList'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { prisma } from '@sikundi/libs/server/prisma'
import Paginate from '@sikundi/components/Paginate'
import stats from '@sikundi/libs/server/stats'

interface Props {
    categories: any
    totalPages: any
    current: any
    statistics: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    const [loading, setLoading] = useState(false)
    const Notes =  dynamic(import('@sikundi/components/Notes'), {
        ssr: false
    })
    const router = useRouter()

    return (
        <Fragment>
            <Container className='grid xl:grid-cols-5 grid-cols-1 xl:gap-4 gap-y-4 py-5 items-start'>
                <div className='xl:col-span-2 grid grid-cols-2 gap-4 order-2 xl:order-1'>
                    {props.statistics?.map((item: any, index: any) => (
                        <InfoBox
                            key={index}
                            className="col-span-2 sm:col-span-1"
                            title={item?.category?.title}
                            value={item?._count?.id}
                            increase={item?.increase}
                            decrease={item?.decrease}
                            caption="Since last month"
                        />
                    ))}
                    <Notes
                        className="col-span-2"
                        rows={15}
                    />
                </div>
                <div className='col-span-3 flex flex-col items-end order-1 xl:order-2'>
                    {
                        props.totalPages > 1 &&
                        <Paginate url={'/articles/categories?page='} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset] lg:hidden" />
                    }
                    <Button className='bg-secondary px-5 mb-5' loading={loading} onClick={()=>router.push('/articles/categories/create')}>New Category</Button>
                    <CategoryList categories={props.categories} />
                    {
                        props.totalPages > 1 &&
                        <Paginate url={'/articles/categories?page='} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset]" />
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
                <title>Categories | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const current = ctx.query.page || 0
    const per_page = 12

    const categories = await prisma.categories.findMany({
        select: {
            id: true,
            title: true,
            published_at: true,
            deleted_at: true,
            _count: {
                select: {
                    posts: true
                }
            }
        },
        take: per_page,
        skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
    })

    const totalCategories = await prisma.categories.aggregate({
        _count: true
    })

    if (categories.length === 0 && ctx.query.page !== undefined) {
        return {
            props: {

            },
            redirect: {
                destination: '/articles/categories',
                permanent: false
            }
        }
    }

    const statistics = await stats()
    
    return {
        props: {
            categories:  JSON.parse(JSON.stringify(categories)),
            totalPages: Math.ceil((Number(totalCategories._count)/per_page)),
            current: current === 0 ? 1 : current,
            statistics: statistics
        }
    }
}

export default Page