import * as data from "@/utils/data"
import { AspectRatio, Modal, Stack, Grid, Text, Anchor } from "@mantine/core"
import Image from "next/image"
import { useQueryState } from "next-usequerystate"
import { ReactElement, useCallback, useRef } from "react"
import QuickPinchZoom, { UpdateAction, make3dTransformValue } from "react-quick-pinch-zoom"

export function useModalImageViewer(): [ReactElement, (img: data.ImageId) => void] {
    const [selectedImage, setSelectedImage] = useQueryState<data.ImageId | null>("view", {
        parse: (query: string) => (query.length == 0 ? null : data.ImageId.parseIdString(query)),
        serialize: (value) => (value ? value.idString : ""),
        history: "push",
    })

    const ref = useRef<HTMLDivElement>(null)
    const onUpdate = useCallback(({ x, y, scale }: UpdateAction) => {
        const { current: img } = ref
        if (img != null) {
            const value = make3dTransformValue({ x, y, scale })
            img.style.setProperty("transform", value)
        }
    }, [])

    const stateSetOptions = {
        scroll: false,
        shallow: true, // Don't run getStaticProps / getServerSideProps / getInitialProps
    }

    function closeImgModal() {
        setSelectedImage(null, stateSetOptions)
    }

    function setImgModal(img: data.ImageId) {
        setSelectedImage(img, stateSetOptions)
    }

    return [
        selectedImage ? (
            <Modal
                opened={selectedImage != null}
                onClose={closeImgModal}
                withCloseButton={false}
                trapFocus={false}
                // Limit height to avoid completely breaking everything on mobile, particularly in landscape
                // TODO: Still not great, come up with something better.
                size={`min(80vh, ${data.imgSize}px)`}
                padding={0}
                m={0}
                overlayProps={{
                    color: "#111",
                    opacity: 0.5,
                    blur: 5,
                }}
                centered
                radius="md"
            >
                <Stack spacing={0}>
                    <QuickPinchZoom doubleTapToggleZoom centerContained enforceBoundsDuringZoom onUpdate={onUpdate}>
                        <AspectRatio ratio={1} ref={ref}>
                            <Image alt="" width={data.imgSize} height={data.imgSize} src={selectedImage.path} />
                        </AspectRatio>
                    </QuickPinchZoom>
                    <Grid align="center" m="xs">
                        <Grid.Col span="content">
                            <Text>
                                Checkpoint:&nbsp;
                                <strong>
                                    <Anchor href={"/checkpoints/" + selectedImage.checkpointId} target="_blank">
                                        {selectedImage.checkpoint.checkpoint_name}
                                    </Anchor>
                                </strong>
                            </Text>
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <Text align="center">
                                Prompt:&nbsp;
                                <Anchor href={selectedImage.advancedUrlForPrompt} target="_blank">
                                    &quot;<em>{selectedImage.prompt}</em>&quot; {selectedImage.negPromptDisplay}
                                </Anchor>
                            </Text>
                        </Grid.Col>
                        <Grid.Col span="content">
                            <Text>
                                Seed: <strong>{selectedImage.seed}</strong>
                            </Text>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Modal>
        ) : (
            <></>
        ),
        setImgModal,
    ]
}
