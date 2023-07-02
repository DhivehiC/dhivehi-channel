import Footer from '@DhivehiChannel/components/Footer'
import Header from '@DhivehiChannel/components/Header'
import '@DhivehiChannel/styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment } from 'react'
import localFont from 'next/font/local'
import { twMerge } from 'tailwind-merge'

const inter = localFont({
    src: [
        {
            path: '../../public/fonts/dhivehi/MV_Faseyha.woff2',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-Thin.woff2',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../../public/fonts/dhivehi/MV_Faseyha.woff2',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-ExtraLight.woff2',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../../public/fonts/dhivehi/MV_Faseyha.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../public/fonts/dhivehi/MV_Faseyha.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/dhivehi/MVWaheed.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../public/fonts/dhivehi/MVWaheed.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-SemiBold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../public/fonts/dhivehi/MVWaheed.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../public/fonts/dhivehi/aammufkF.ttf',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-ExtraBold.woff2',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../../public/fonts/dhivehi/aammufkF.ttf',
            weight: '900',
            style: 'normal',
        },
        {
            path: '../../public/fonts/inter/Inter-Black.woff2',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-inter',
    display: 'swap',
    adjustFontFallback: 'Times New Roman'
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Fragment>
            <Header className={inter.className} />
            <main className={twMerge([
                inter.className,
                'min-h-screen w-full'
            ])}>
                <Component {...pageProps} />
            </main>
            <Footer className={inter.className} />
        </Fragment>
    )
}
