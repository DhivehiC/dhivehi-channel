import '../styles/globals.css'
import { Fragment, ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import RootLayout from '@sikundi/layouts/RootLayout'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)

    return getLayout(
        <RootLayout>
            <NextNProgress color='#C62128' height={4} />
            <Component {...pageProps} />
        </RootLayout>
    )
}