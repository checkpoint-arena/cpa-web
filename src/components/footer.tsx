import { Stack, Divider, Group, Text, Anchor } from "@mantine/core"

import * as data from "@/utils/data"

export default function Footer() {
    return (
        <Stack>
            <Divider
                label={
                    <>
                        <i>Fin</i>&nbsp;<a href="#">(Back to top)</a>
                    </>
                }
                labelPosition="center"
                pt="lg"
            />
            <Stack p="sm" pt={0} align="end" spacing="0">
                <Text size="sm">Dataset date: {new Date(data.genTime).toDateString()}</Text>
                <Anchor href="https://github.com/checkpoint-arena" target="_blank" size="sm">
                    Checkpoint Arena on GitHub
                </Anchor>
            </Stack>
        </Stack>
    )
}
