import { Container } from "@mantine/core"
import React from "react"

interface PageContainerProps {
    children: React.ReactNode
}

/**
 * Fluid container with a maximum width for ultra-wide monitors.
 */
export default function PageContainer(props: PageContainerProps) {
    return (
        <Container size="fluid" maw={2200}>
            {props.children}
        </Container>
    )
}
