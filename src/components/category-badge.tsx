import { Badge } from "@mantine/core"

import { CategoryId } from "@/utils/data"

interface CategoryBadgeProps {
    category: CategoryId
    small?: boolean
}

const defaultProps: Partial<CategoryBadgeProps> = {
    small: false,
}

export default function CategoryBadge(props: CategoryBadgeProps) {
    props = { ...defaultProps, ...props }
    const data: { [key in CategoryId]: [string, string, string] } = {
        anime: ["Anime", "A", "grape"],
        other: ["Other", "O", "blue"],
        photo: ["Photo", "P", "teal"],
    }
    const label = data[props.category][props.small ? 1 : 0]
    const color = data[props.category][2]
    return (
        <Badge color={color} size="sm">
            {label}
        </Badge>
    )
}
