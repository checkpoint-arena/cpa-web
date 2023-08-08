import { AspectRatio, Text, createStyles, getStylesRef } from "@mantine/core"
import { IconSeeding } from "@tabler/icons-react"
import Image from "next/image"

import { ImageId } from "@/utils/data"
import CategoryBadge from "@/components/category-badge"

interface ThumbCardProps {
    image: ImageId
    onClick?: (image: ImageId) => void
}

const useStyles = createStyles((theme, props: ThumbCardProps) => ({
    card: {
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 100ms",
        transitionTimingFunction: "ease",
        margin: 2,
        borderRadius: theme.radius.sm,
        cursor: props.onClick !== undefined ? "pointer" : "default",

        "& img": {
            transition: "transform 200ms",
            transitionTimingFunction: "ease",
        },

        "&:hover": {
            boxShadow: theme.shadows.lg,

            "& img": {
                transform: "scale(1.1)",
                transitionTimingFunction: "cubic-bezier(0.87, 0, 0.13, 1)",
            },

            [`& .${getStylesRef("meta")}`]: {
                opacity: 1,
                transitionTimingFunction: "cubic-bezier(0.87, 0, 0.13, 1)",
            },
        },
    },

    meta: {
        ref: getStylesRef("meta"),

        position: "absolute",
        backdropFilter: "blur(7px) saturate(130%)",
        bottom: -1, // there's a 1px gap otherwise for some reason
        left: 0,
        right: 0,
        background: "linear-gradient(350deg, rgb(37 37 43 / 67%) 0%, rgb(200 237 255 / 38%) 100%)",
        boxShadow: "inset rgb(255 255 255 / 4%) 0px 0px 14px 1px",
        padding: theme.spacing.sm,
        color: "white",
        textShadow: "0 0 3px #0000005c",

        transition: "opacity 200ms",
        transitionTimingFunction: "ease",
        opacity: 0,
    },

    nameAndCat: {
        display: "flex",
        justifyContent: "space-between",

        "& > :first-child": {
            flex: 1,
        },

        "& > :last-child": {
            flexShrink: 0,
        },
    },
}))

export default function ThumbCard(props: ThumbCardProps) {
    const styles = useStyles(props)
    const { image } = props
    const handleClick = () => {
        props.onClick && props.onClick(image)
    }

    return (
        <div className={styles.classes.card} onClick={handleClick}>
            <AspectRatio ratio={1}>
                <Image
                    // TODO: Improve alt text
                    alt={`'${image.prompt}' with seed ${image.seed}`}
                    width={256}
                    height={256}
                    src={image.thumbPath}
                />
            </AspectRatio>
            <div className={styles.classes.meta}>
                <div className={styles.classes.nameAndCat}>
                    <Text fz="sm" truncate>
                        {image.checkpoint.checkpoint_name}
                    </Text>
                    <CategoryBadge category={image.checkpoint.category} />
                </div>
                <div className={styles.classes.nameAndCat}>
                    <Text fz="sm" truncate>
                        &quot;<em>{image.prompt}</em>&quot; {image.negPromptDisplay}
                    </Text>
                    <Text fz="sm" aria-label={`Seed: ${image.seed}`}>
                        <IconSeeding size={14} stroke={3} />
                        &nbsp;{image.seed}
                    </Text>
                </div>
            </div>
        </div>
    )
}
