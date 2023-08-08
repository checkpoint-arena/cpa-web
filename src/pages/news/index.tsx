import Head from "next/head"
import { Container } from "@mantine/core"

import * as FirstPost from "./posts/2023-08-06.mdx"

export default function About() {
    return (
        <>
            <Head>
                <title>News - Checkpoint Arena</title>
            </Head>
            <Container>
                <FirstPost.default />
            </Container>
        </>
    )
}
