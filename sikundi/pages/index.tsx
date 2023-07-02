import Container from "@sikundi/components/Container"
import InfoBox from "@sikundi/components/InfoBox"
import DashboardLayout from "@sikundi/layouts/DashboardLayout"
import { GetServerSideProps } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { Fragment, ReactElement, useEffect, useState } from "react"
import type { NextPageWithLayout } from "./_app"
import { prisma } from "@sikundi/libs/server/prisma"
import dayjs from "dayjs"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import TopArticleList from "@sikundi/components/lists/TopArticleList"
import stats from "@sikundi/libs/server/stats"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
)

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "December Months Analytics",
        },
    },
}

interface Props {
    analytics: any
    topArticles: any
    pendingArticles: any
    statistics: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    const Notes = dynamic(import("@sikundi/components/Notes"), {
        ssr: false,
    })

    return (
        <Fragment>
            <Container className="grid xl:grid-cols-5 grid-cols-1 xl:gap-4 gap-y-4 py-5 items-start">
                <div className="col-span-3 flex flex-col items-end order-1 xl:order-1">
                    <div className="bg-secondary w-full rounded-md p-4 mb-4">
                        <Line
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top" as const,
                                    },
                                    title: {
                                        display: true,
                                        text: `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][new Date().getMonth()]} Months Analytics`,
                                        color: "white",
                                    },
                                },
                                color: "white",
                                scales: {
                                    y: {
                                        ticks: {
                                            color: "white",
                                        },
                                    },
                                    x: {
                                        ticks: {
                                            color: "white",
                                        },
                                    },
                                },
                            }}
                            data={props.analytics}
                        />
                    </div>
                    <TopArticleList articles={props.topArticles} />
                </div>
                <div className="xl:col-span-2 grid grid-cols-2 gap-4 order-2 xl:order-2">
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
                    <Notes className="col-span-2" rows={15} />
                </div>
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Dashboard | sikundi</title>
            </Head>
            <DashboardLayout>{page}</DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const views = await prisma?.viewCount.groupBy({
        by: ["created_at"],
        _sum: {
            count: true,
        },
        orderBy: {
            created_at: "desc",
        },
        take: 30,
    })

    const analytics = () => {
        const labels: any = []
        const data: any = []
        views?.reverse()?.map((view: any) => {
            labels.push(dayjs(view?.created_at).format("MMM, DD"))
            data.push(view?._sum?.count)
        })
        return {
            labels: labels,
            datasets: [
                {
                    fill: true,
                    label: "views",
                    data: data,
                    borderColor: "#CA2128",
                    backgroundColor: "#CA212850",
                },
            ],
        }
    }

    const topArticles = await prisma.posts.findMany({
        select: {
            id: true,
            title: true,
            total_view_count: true,
            created_by: {
                select: {
                    user_name: true,
                },
            },
        },
        take: 10,
        orderBy: {
            total_view_count: "desc",
        },
    })

    const statistics = await stats()

    return {
        props: {
            analytics: analytics(),
            topArticles: topArticles,
            statistics: statistics,
        },
    }
}

export default Page
