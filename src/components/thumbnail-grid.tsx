import { createStyles } from "@mantine/core"
import * as data from "@/utils/data"

interface ThumbnailGridProps {
    columns: number
    children: React.ReactNode[]
}

const useStyles = createStyles((theme, { columns }: ThumbnailGridProps) => ({
    thumbnailGrid: {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, ${data.thumbSize}px));`,
        gap: `1rem 1rem`,
        justifyContent: "center",
        [theme.fn.smallerThan((data.thumbSize + 5) * columns)]: {
            gap: `3px 3px`,
        },
        [theme.fn.smallerThan(data.thumbSize * columns * 0.75)]: {
            gridTemplateColumns: `repeat(${columns / 2}, minmax(0, ${data.thumbSize}px))`,
        },
        [theme.fn.smallerThan((data.thumbSize * columns * 0.75) / 2)]: {
            gridTemplateColumns: `repeat(${columns / 3}, minmax(0, ${data.thumbSize}px))`,
        },
        [theme.fn.smallerThan((data.thumbSize * columns * 0.75) / 3)]: {
            gridTemplateColumns: `repeat(${columns / 4}, minmax(0, ${data.thumbSize}px))`,
        },
    },
}))

// TODO Should this do the thumbnail rendering as well?
export default function ThumbnailGrid(props: ThumbnailGridProps) {
    const styles = useStyles(props)
    return <div className={styles.classes.thumbnailGrid}>{props.children}</div>
}
