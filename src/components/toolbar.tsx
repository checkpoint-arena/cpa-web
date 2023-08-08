import React from "react"
import { Container, Group } from "@mantine/core"

interface ToolbarProps {
    children: React.ReactNode
}

export default function Toolbar(props: ToolbarProps) {
    return (
        <Container size="xl">
            <Group position="center" pb="sm">
                {props.children}
            </Group>
        </Container>
    )
}
