import ArticleList from '@sikundi/components/lists/ArticleList'
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
import Input from '@sikundi/components/Input'
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon'
import { SubmitHandler, useForm } from 'react-hook-form'
import stats from '@sikundi/libs/server/stats'

interface Props {
    articles: any
    totalPages: any
    current: any
    postCounts: any
    statistics: any
}

type Inputs = {
    search: string
}

const Page: NextPageWithLayout<Props> = (props) => {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, setValue, getValues, control } = useForm<Inputs>()
    const Notes =  dynamic(import('@sikundi/components/Notes'), {
        ssr: false
    })
    const onSubmit: SubmitHandler<Inputs> = (data:any) => {
        console.log(data)
        router.push(`/articles?query=${data.search}`)
    }

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
                        <Paginate url={`/articles?query=${String(router.query['query'] || "")}&page=`} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset] lg:hidden" />
                    }
                    <div className='flex w-full gap-4 justify-between flex-col md:flex-row'>
                        <form className='flex md:mb-5 w-full md:max-w-sm' onSubmit={handleSubmit(onSubmit)}>
                            <Input 
                                placeholder='Search' type={'text'} className="w-full bg-secondary mb-0 rounded-none rounded-l-md focus:border-0"
                                {...register('search')}
                            />
                            <Button className='bg-secondary px-3 mb-0 rounded-none rounded-r-md' loading={loading}>
                                <MagnifyingGlassIcon className='h-5 w-5 text-accent' />
                            </Button>
                        </form>
                        <Button className='bg-secondary px-5 mb-5' loading={loading} type={"button"} onClick={()=>router.push('/articles/create')}>New Article</Button>
                    </div>
                    <ArticleList articles={props.articles} postCounts={props.postCounts} />
                    {
                        props.totalPages > 1 &&
                        <Paginate url={`/articles?query=${String(router.query['query'] || "")}&page=`} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset]" />
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
                <title>Articles | sikundi</title>
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
    const search = ctx.query.query
    const per_page = 12
    const token = ctx.req.cookies['token']
    const secret = process.env.ACCESS_TOKEN_SECRET
    const {payload} = await jwtVerify(String(token), new TextEncoder().encode(secret))
    let filters = {}
    if (filter_by === "published") {
        filters = {...filters, 
            published_at: {
                not: null
            }
        }
    }
    if (filter_by === "draft") {
        filters = {...filters, 
            AND: [
                {
                    published_at: {
                        equals: null
                    }
                },
                {
                    deleted_at: {
                        equals: null
                    }
                }
            ]
        }
    }
    if (filter_by === "deleted") {
        filters = {...filters, 
            deleted_at: {
                not: null
            }
        }
    }
    if (filter_by === "mine") {
        filters = {...filters, 
            created_by: {
                id: payload.id
            }
        }
    }

    let countFilters = {}
    if (String(search)?.length > 0) {
        filters = {...filters, 
            title: {
                contains: search
            }
        }
        countFilters = {...countFilters, 
            title: {
                contains: search
            }
        }
    }

    const counts = {
        published: await prisma.posts.count({
            where: {
                published_at: {
                    not: null
                },
                ...countFilters
            }
        }),
        draft: await prisma.posts.count({
            where: {
                AND: [
                    {
                        published_at: {
                            equals: null
                        }
                    },
                    {
                        deleted_at: {
                            equals: null
                        }
                    },
                    countFilters
                ]
            }
        }),
        deleted: await prisma.posts.count({
            where: {
                deleted_at: {
                    not: null
                },
                ...countFilters
            }
        }),
        mine: await prisma.posts.count({
            where: {
                created_by: {
                    id: parseInt(String(payload.id))
                },
                ...countFilters
            }
        })
    }

    const articles = await prisma.posts.findMany({
        select: {
            id: true,
            title:true,
            published_at: true,
            deleted_at: true,
            created_by: {
                select: {
                    user_name: true
                }
            },
            total_view_count: true
        },
        where: filters,
        orderBy: {
            created_at: 'desc'
        },
        take: per_page,
        skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
    })
    const totalArticles = await prisma.posts.aggregate({
        _count: true,
        where: filters
    })

    if (articles.length === 0 && ctx.query.page !== undefined) {
        return {
            props: {

            },
            redirect: {
                destination: '/articles',
                permanent: false
            }
        }
    }

    const statistics = await stats()
    
    return {
        props: {
            articles: JSON.parse(JSON.stringify(articles)),
            totalPages: Math.ceil((Number(totalArticles._count)/per_page)),
            current: current === 0 ? 1 : current,
            postCounts: counts,
            statistics: statistics
        }
    }
}

export default Page