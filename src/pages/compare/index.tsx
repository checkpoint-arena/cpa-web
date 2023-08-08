import { useMemo, useState } from "react"
import { createStyles, Select, Box, AspectRatio, SimpleGrid, Overlay, ActionIcon, Center, Group } from "@mantine/core"
import { Carousel, Embla } from "@mantine/carousel"
import Head from "next/head"
import Image from "next/image"
import { IconChevronsUp, IconChevronsDown, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react"
import { queryTypes } from "next-usequerystate"

import * as data from "@/utils/data"
import PageContainer from "@/components/page-container"
import { SegmentedInput } from "@/components/segmented-input"
import Toolbar from "@/components/toolbar"
import { CheckpointSelect } from "@/components/checkpoint-select"
import { useIsFirstRender, useQueryStateNoScroll } from "@/utils/hooks"
import { useMediaQuery } from "@mantine/hooks"

const useArrowButtonsStyles = createStyles((theme) => ({
    navigation: {
        "> *": {
            opacity: 0,
        },
        "&:hover > *": {
            opacity: 1,
        },
    },
}))

interface ArrowButtonsProps {
    onLeftClick: () => void
    onRightClick: () => void
    onUpClick: () => void
    onDownClick: () => void
}

function ArrowButtons({ onLeftClick, onRightClick, onUpClick, onDownClick }: ArrowButtonsProps) {
    const { classes } = useArrowButtonsStyles()
    return (
        <Overlay opacity={0} className={classes.navigation}>
            <SimpleGrid cols={3} w="100%" h="100%">
                <div />
                <Center>
                    <ActionIcon onClick={onUpClick} radius="md" variant="filled">
                        <IconChevronsUp />
                    </ActionIcon>
                </Center>
                <div />
                <Center>
                    <ActionIcon onClick={onLeftClick} radius="md" variant="filled">
                        <IconChevronsLeft />
                    </ActionIcon>
                </Center>
                <div />
                <Center>
                    <ActionIcon onClick={onRightClick} radius="md" variant="filled">
                        <IconChevronsRight />
                    </ActionIcon>
                </Center>
                <div />
                <Center>
                    <ActionIcon onClick={onDownClick} radius="md" variant="filled">
                        <IconChevronsDown />
                    </ActionIcon>
                </Center>
                <div />
            </SimpleGrid>
        </Overlay>
    )
}

const useStyles = createStyles((theme) => ({
    comparisonWrapper: {
        display: "flex",

        ["& > *"]: {
            flex: 1,
        },

        // On small screens show below each other instead of side-by-side
        [theme.fn.smallerThan("sm")]: {
            flexDirection: "column",
            ["& > *"]: {
                width: "100%",
            },
        },
    },
}))

export default function ComparePage() {
    const cp1Type = queryTypes.stringEnum(data.checkpoints).withDefault(data.checkpoints[0])
    const [checkpoint1, setCheckpoint1] = useQueryStateNoScroll<data.CheckpointId>("cp1", cp1Type)
    const cp2Type = queryTypes.stringEnum(data.checkpoints).withDefault(data.checkpoints[1])
    const [checkpoint2, setCheckpoint2] = useQueryStateNoScroll<data.CheckpointId>("cp2", cp2Type)
    const [seed1, setSeed1] = useQueryStateNoScroll<string>("seed1", queryTypes.string.withDefault(data.seedOffset.toString()))
    const [seed2, setSeed2] = useQueryStateNoScroll<string>("seed2", queryTypes.string.withDefault(""))
    const negPromptType = queryTypes.stringEnum<data.NegPrompt>(Object.values(data.NegPrompt)).withDefault(data.NegPrompt.Sfw)
    const [negativePrompt, setNegativePrompt] = useQueryStateNoScroll<data.NegPrompt>("neg", negPromptType)
    const promptType = queryTypes.stringEnum(data.prompts).withDefault(data.prompts[0])
    const [prompt, setPrompt] = useQueryStateNoScroll<data.PromptId>("prompt", promptType)

    const styles = useStyles()
    const [embla, setEmbla] = useState<Embla | null>(null)
    const isFirstRender = useIsFirstRender()
    const isSmallScreen = useMediaQuery("(max-width: 768px)")

    // Hack: Since Mantine does not expose Embla's startIndex option, we have to manually rotate
    // the prompts array to start at the prompt that is selected on page load
    const promptsForCarousel = useMemo(() => {
        const promptIdx = data.prompts.indexOf(prompt)
        return data.prompts.slice(promptIdx, data.prompts.length).concat(data.prompts.slice(0, promptIdx))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const cycleSeed = (seed: string, delta: 1 | -1) => {
        const seedId = parseInt(seed) - data.seedOffset
        let newSeed = data.seedOffset + ((seedId + delta) % data.numSeeds)
        if (newSeed < data.seedOffset) newSeed = data.seedOffset + data.numSeeds - 1
        return newSeed.toString()
    }
    const cycleCheckpoint = (checkpoint: data.CheckpointId, delta: 1 | -1) => {
        const idx = data.checkpoints.findIndex((c) => c == checkpoint)
        let newCheckpoint = (idx + delta) % data.checkpoints.length
        if (newCheckpoint < 0) newCheckpoint = data.checkpoints.length - 1
        return data.checkpoints[newCheckpoint]
    }

    if (isFirstRender) return null
    return (
        <>
            <Head>
                <title>Compare - Checkpoint Arena</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <PageContainer>
                <Toolbar>
                    <Group noWrap>
                        <CheckpointSelect value={[checkpoint1]} onChange={(cps) => setCheckpoint1(cps[0])} />
                        <Select
                            label="Seed"
                            data={data.allSeeds.map((s) => s.toString())}
                            value={seed1}
                            rightSection={<div />}
                            rightSectionWidth={"0px"}
                            miw="50px"
                            onChange={setSeed1}
                        />
                    </Group>
                    <Group noWrap>
                        <CheckpointSelect label="Compare against" value={[checkpoint2]} onChange={(cps) => setCheckpoint2(cps[0])} />
                        <Select
                            label="Seed"
                            placeholder={`${seed1} (same as other)`}
                            clearable
                            data={data.allSeeds.map((s) => s.toString())}
                            value={seed2}
                            rightSection={<div />}
                            rightSectionWidth={"0px"}
                            miw="50px"
                            onChange={setSeed2}
                        />
                    </Group>
                    <SegmentedInput
                        label="Negative Prompt"
                        data={data.negativePromptOptions}
                        value={negativePrompt}
                        onChange={setNegativePrompt as (v: string) => void}
                    />
                </Toolbar>
                <div className={styles.classes.comparisonWrapper}>
                    <AspectRatio ratio={1} maw={1024} mr="auto">
                        <Image
                            alt=""
                            width={1024}
                            height={1024}
                            src={new data.ImageId(checkpoint1, prompt, negativePrompt, parseInt(seed1)).path}
                        />
                        <ArrowButtons
                            onUpClick={() => setCheckpoint1(cycleCheckpoint(checkpoint1, -1))}
                            onDownClick={() => setCheckpoint1(cycleCheckpoint(checkpoint1, +1))}
                            onLeftClick={() => setSeed1(cycleSeed(seed1, -1))}
                            onRightClick={() => setSeed1(cycleSeed(seed1, +1))}
                        />
                    </AspectRatio>
                    <AspectRatio ratio={1} maw={1024} ml="auto">
                        <Image
                            alt=""
                            width={1024}
                            height={1024}
                            src={new data.ImageId(checkpoint2, prompt, negativePrompt, parseInt(seed2 || seed1)).path}
                        />
                        <ArrowButtons
                            onUpClick={() => setCheckpoint2(cycleCheckpoint(checkpoint2, -1))}
                            onDownClick={() => setCheckpoint2(cycleCheckpoint(checkpoint2, +1))}
                            onLeftClick={() => setSeed2(cycleSeed(seed2 || seed1, -1))}
                            onRightClick={() => setSeed2(cycleSeed(seed2 || seed1, +1))}
                        />
                    </AspectRatio>
                </div>
                <Carousel
                    mx="auto"
                    mt="md"
                    slideGap="md"
                    controlsOffset="md"
                    slideSize="10%"
                    loop
                    skipSnaps
                    getEmblaApi={setEmbla}
                    onSlideChange={(i) => setPrompt(promptsForCarousel[i])}
                >
                    {promptsForCarousel.map((prompt, i) => (
                        <Carousel.Slide key={prompt}>
                            <Image
                                alt=""
                                width={isSmallScreen ? 128 : 256}
                                height={isSmallScreen ? 128 : 256}
                                src={new data.ImageId(checkpoint1, prompt, negativePrompt, parseInt(seed1 ?? data.seedOffset)).thumbPath}
                                onClick={(e) => {
                                    if (embla !== null) {
                                        embla.scrollTo(i)
                                    }
                                    // Fix for https://github.com/mantinedev/mantine/issues/4174
                                    e.stopPropagation()
                                }}
                            />
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </PageContainer>
        </>
    )
}
