import { useRouter } from "next/router"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { queryTypes } from "next-usequerystate"
import { IconDownload } from "@tabler/icons-react"

import { useModalImageViewer } from "@/components/modalimageviewer"
import ThumbCard from "@/components/thumb-card"
import * as data from "@/utils/data"
import ThumbnailGrid from "@/components/thumbnail-grid"
import PageContainer from "@/components/page-container"
import { SegmentedInput } from "@/components/segmented-input"
import { CheckpointSelect } from "@/components/checkpoint-select"
import Toolbar from "@/components/toolbar"
import { useIsFirstRender, useQueryStateNoScroll } from "@/utils/hooks"
import { ActionIcon, Group, Tooltip } from "@mantine/core"

interface CheckpointPageQuery extends ParsedUrlQuery {
    id?: data.CheckpointId
}

export default function CheckpointPage() {
    const router = useRouter()
    const query = router.query as CheckpointPageQuery
    const checkpointId = query.id

    const [negativePrompt, setNegativePrompt] = useQueryStateNoScroll<data.NegPrompt>(
        "neg",
        queryTypes.stringEnum<data.NegPrompt>(Object.values(data.NegPrompt)).withDefault(data.NegPrompt.Sfw),
    )

    const [modalImgView, setImgModal] = useModalImageViewer()
    const isFirstRender = useIsFirstRender()

    if (!router.isReady || checkpointId == null) return null

    const checkpoint = data.getCheckpoint(checkpointId)

    if (checkpoint.checkpoint === "unknown") {
        return <div>Error: Unknown checkpoint</div>
    }

    const changeCheckpoint = (cp: string) => {
        const newState = { ...router, query: { ...query, id: cp } }
        router.push(newState)
    }

    if (isFirstRender) return null
    return (
        <>
            <Head>
                <title>{checkpoint.checkpoint_name} - Checkpoint Arena</title>
            </Head>

            {modalImgView}

            <PageContainer>
                <Toolbar>
                    <Group align="end">
                        <CheckpointSelect value={[checkpointId]} onChange={(cps) => changeCheckpoint(cps[0])} />
                        <a href={checkpoint.url} target="_blank">
                            <Tooltip label="Download checkpoint">
                                <ActionIcon variant="filled" size="lg" mb="2px" color="blue">
                                    <IconDownload size="1rem" />
                                </ActionIcon>
                            </Tooltip>
                        </a>
                        <SegmentedInput
                            label="Negative Prompt"
                            data={data.negativePromptOptions}
                            value={negativePrompt}
                            onChange={setNegativePrompt as (v: string) => void}
                        />
                    </Group>
                </Toolbar>
                <ThumbnailGrid columns={6}>
                    {data.selectImages([checkpointId], data.prompts, [negativePrompt], data.allSeeds).map((info) => (
                        <ThumbCard key={info.idString} image={info} onClick={setImgModal} />
                    ))}
                </ThumbnailGrid>
            </PageContainer>
        </>
    )
}

export async function getStaticProps() {
    return { props: {} }
}

// Return list of all possible URLs so we can generate them statically
export async function getStaticPaths() {
    const paths = data.checkpoints.map((id) => ({
        params: { id },
    }))
    return { paths, fallback: false }
}
