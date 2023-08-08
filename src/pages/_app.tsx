import { AppProps } from "next/app"
import Head from "next/head"
import { MantineProvider } from "@mantine/core"

import "@/styles/globals.css"
import { HeaderResponsive } from "@/components/header"
import Footer from "@/components/footer"

export default function App(props: AppProps) {
    const { Component, pageProps } = props
    const description = "Compare different Stable Diffusion checkpoints across a set of uniform, standardized and simple prompts"
    return (
        <>
            <Head>
                <title>Checkpoint Arena</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <meta name="description" content={description} />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://checkpoint-arena.com" />
                <meta property="og:title" content="Checkpoint Arena" />
                <meta property="og:description" content={description} />
                <meta property="og:image" content="/android-chrome-256x256.png" />
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: "dark",
                }}
            >
                <HeaderResponsive
                    links={[
                        { link: "/checkpoints", label: "Checkpoints" },
                        { link: "/compare", label: "Compare" },
                        { link: "/advanced", label: "Advanced" },
                        { link: "/about", label: "About" },
                        { link: "/news", label: "News" },
                    ]}
                />
                <Component {...pageProps} />
                <Footer />
            </MantineProvider>
        </>
    )
}
