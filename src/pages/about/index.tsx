import Head from "next/head"
import { Container } from "@mantine/core"

import AboutMd from "./about.mdx"

export default function AboutPage() {
    return (
        <>
            <Head>
                <title>About - Checkpoint Arena</title>
            </Head>
            <Container>
                <AboutMd />
            </Container>
        </>
    )
}
