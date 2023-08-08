import React, { useEffect } from "react"
import { MultiSelect, Checkbox, Group, SimpleGrid, Button, Menu } from "@mantine/core"
import { queryTypes } from "next-usequerystate"
import Head from "next/head"

import { useModalImageViewer } from "@/components/modalimageviewer"
import ThumbCard from "@/components/thumb-card"
import * as data from "@/utils/data"
import ThumbnailGrid from "@/components/thumbnail-grid"
import PageContainer from "@/components/page-container"
import { CheckpointSelect } from "@/components/checkpoint-select"
import Toolbar from "@/components/toolbar"
import { useIsFirstRender, useQueryStateNoScroll } from "@/utils/hooks"

export default function AdvancedPage() {
    const seedType = queryTypes.array(queryTypes.integer).withDefault(data.allSeeds)
    const [selectedSeeds, setSelectedSeeds] = useQueryStateNoScroll<Array<number>>("seeds", seedType)
    const cpsType = queryTypes.array(queryTypes.stringEnum(data.checkpoints)).withDefault([])
    const [selectedCheckpoints, setSelectedCheckpoints] = useQueryStateNoScroll<Array<data.CheckpointId>>("cps", cpsType)
    const promptsType = queryTypes.array(queryTypes.stringEnum(data.prompts)).withDefault([])
    const [selectedPrompts, setSelectedPrompts] = useQueryStateNoScroll<Array<data.PromptId>>("prompts", promptsType)
    const negPromptsType = queryTypes
        .array(queryTypes.stringEnum<data.NegPrompt>(Object.values(data.NegPrompt)))
        .withDefault([data.NegPrompt.Sfw])
    const [selectedNegPrompts, setSelectedNegPrompts] = useQueryStateNoScroll<Array<data.NegPrompt>>("neg", negPromptsType)

    const [modalImgView, setImgModal] = useModalImageViewer()
    const isFirstRender = useIsFirstRender()

    function addAllCheckpoints(category: data.CategoryId | typeof data.allCategory) {
        const toAdd = data.getCheckpoints(category)
        let newCheckpoints = [...selectedCheckpoints]
        for (const cp of toAdd) {
            if (!selectedCheckpoints.includes(cp)) {
                newCheckpoints.push(cp)
            }
        }
        setSelectedCheckpoints(newCheckpoints)
    }

    // randomly initialize selected checkpoint and prompt, if none are set
    useEffect(() => {
        ;(async () => {
            if (selectedCheckpoints.length === 0) {
                await setSelectedCheckpoints([data.getRandomCheckpointId()])
            }
            if (selectedPrompts.length === 0) {
                await setSelectedPrompts([data.getRandomPromptId()])
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isFirstRender) return null
    return (
        <>
            <Head>
                <title>Advanced - Checkpoint Arena</title>
            </Head>

            {modalImgView}

            <PageContainer>
                <Toolbar>
                    <Group align="end" position="center" grow w="100%">
                        <CheckpointSelect multiple value={selectedCheckpoints} onChange={setSelectedCheckpoints} />
                        <Menu shadow="md">
                            <Menu.Target>
                                <Button maw={100} /* HACK */>Add all...</Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {data.categories.map((id) => (
                                    <Menu.Item key={id} onClick={() => addAllCheckpoints(id)}>
                                        {data.categoryNames[id]}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                    <MultiSelect
                        label="Prompts"
                        searchable
                        clearable
                        nothingFound="No results"
                        data={data.prompts}
                        value={selectedPrompts}
                        onChange={setSelectedPrompts as (values: string[]) => void}
                    />
                    <MultiSelect
                        label="Negative Prompts"
                        searchable
                        clearable
                        nothingFound="No results"
                        data={data.negativePromptOptions}
                        value={selectedNegPrompts}
                        onChange={setSelectedNegPrompts as (value: string[]) => void}
                    />
                    <Checkbox.Group
                        label="Seeds"
                        value={selectedSeeds.map((i) => i.toString())}
                        onChange={(newSeeds) => setSelectedSeeds(newSeeds.map((s) => parseInt(s)))}
                    >
                        <SimpleGrid cols={3} spacing="md" verticalSpacing={3}>
                            {data.allSeeds.map((seed, i) => {
                                return <Checkbox key={i} size="xs" label={seed} value={seed.toString()} />
                            })}
                        </SimpleGrid>
                    </Checkbox.Group>
                </Toolbar>
                <ThumbnailGrid columns={data.allSeeds.length}>
                    {data.selectImages(selectedCheckpoints, selectedPrompts, selectedNegPrompts, selectedSeeds).map((info) => (
                        <ThumbCard key={info.idString} image={info} onClick={setImgModal} />
                    ))}
                </ThumbnailGrid>
            </PageContainer>
        </>
    )
}
