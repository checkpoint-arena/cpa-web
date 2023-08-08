import { Divider, Text, SimpleGrid, Pagination, Stack, useMantineTheme } from "@mantine/core"
import Head from "next/head"
import { queryTypes } from "next-usequerystate"
import Link from "next/link"

import * as data from "@/utils/data"
import CategoryBadge from "@/components/category-badge"
import ThumbCard from "@/components/thumb-card"
import { useModalImageViewer } from "@/components/modalimageviewer"
import PageContainer from "@/components/page-container"
import { SegmentedInput } from "@/components/segmented-input"
import Toolbar from "@/components/toolbar"
import { useIsFirstRender, useQueryStateNoScroll } from "@/utils/hooks"
import { useState } from "react"

export default function CheckpointsPage() {
    const theme = useMantineTheme()
    const catType = queryTypes.stringEnum([...data.categories, data.allCategory]).withDefault(data.allCategory)
    const [categoryFilter, setCategoryFilter] = useQueryStateNoScroll<data.CategoryId | typeof data.allCategory>("cat", catType)
    const negPromptType = queryTypes.stringEnum<data.NegPrompt>(Object.values(data.NegPrompt)).withDefault(data.NegPrompt.Sfw)
    const [negativePrompt, setNegativePrompt] = useQueryStateNoScroll<data.NegPrompt>("neg", negPromptType)
    const [modalImgView, setImgModal] = useModalImageViewer()
    const isFirstRender = useIsFirstRender()

    const checkpoints = data.getCheckpoints(categoryFilter)

    const checkpointsPerPage = 10
    const totalPages = Math.ceil(checkpoints.length / checkpointsPerPage)
    const [activePage, setPage] = useState<number>(1)

    const setCategoryFilterAndResetPage = (category: string) => {
        setCategoryFilter(category as data.CategoryId)
        setPage(1)
    }

    if (isFirstRender) return null
    return (
        <>
            <Head>
                <title>Checkpoints - Checkpoint Arena</title>
            </Head>

            {modalImgView}

            <PageContainer>
                <Toolbar>
                    <SegmentedInput
                        label="Category"
                        data={data.categories.map((id) => ({ label: data.categoryNames[id], value: id }))}
                        value={categoryFilter}
                        onChange={setCategoryFilterAndResetPage}
                    />
                    <SegmentedInput
                        label="Negative Prompt"
                        data={data.negativePromptOptions}
                        value={negativePrompt}
                        onChange={setNegativePrompt as (v: string) => void}
                    />
                </Toolbar>
                {checkpoints.slice((activePage - 1) * checkpointsPerPage, activePage * checkpointsPerPage).map((checkpointId) => (
                    <div key={checkpointId}>
                        <Divider
                            size="md"
                            label={
                                <>
                                    <Link href={"/checkpoints/" + checkpointId}>
                                        <Text fz="md" fw={700}>
                                            {data.getCheckpoint(checkpointId).checkpoint_name}
                                        </Text>
                                    </Link>
                                    &nbsp;
                                    <CategoryBadge category={data.getCheckpoint(checkpointId).category} />
                                </>
                            }
                        />
                        <SimpleGrid
                            cols={data.prompts.length}
                            spacing={0}
                            pos="relative"
                            breakpoints={[{ maxWidth: (data.thumbSize + parseInt(theme.spacing.xs)) * 4, cols: 7 }]}
                        >
                            {data
                                .selectImages([checkpointId], data.prompts, [negativePrompt as data.NegPrompt], [data.seedOffset])
                                .map((info) => (
                                    <ThumbCard key={info.idString} image={info} onClick={setImgModal} />
                                ))}
                        </SimpleGrid>
                    </div>
                ))}
                <Stack align="center" p="lg">
                    <Text>{checkpoints.length} checkpoints total</Text>
                    <Pagination value={activePage} onChange={setPage} total={totalPages} />
                </Stack>
            </PageContainer>
        </>
    )
}
