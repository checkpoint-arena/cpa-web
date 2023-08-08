import React, { useMemo, forwardRef } from "react"
import { MultiSelect, MultiSelectValueProps, Select, SelectProps, Box, rem, CloseButton, MultiSelectProps } from "@mantine/core"

import * as data from "@/utils/data"
import CategoryBadge from "@/components/category-badge"

interface CheckpointSelectItemProps extends React.ComponentPropsWithoutRef<"div"> {
    label: string
    category: data.CategoryId
}

const CheckpointSelectItem = forwardRef<HTMLDivElement, CheckpointSelectItemProps>(function CheckpointSelectItem(
    { label, category, ...others }: CheckpointSelectItemProps,
    ref,
) {
    return (
        <div ref={ref} {...others} style={{ display: "flex", justifyContent: "space-between" }}>
            {label} <CategoryBadge category={category} />
        </div>
    )
})

function CheckpointSelectValue({
    value,
    label,
    onRemove,
    classNames,
    category,
    ...others
}: MultiSelectValueProps & { value: string; category: data.CategoryId }) {
    return (
        <div {...others}>
            <Box
                sx={(theme) => ({
                    display: "flex",
                    cursor: "default",
                    alignItems: "center",
                    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
                    border: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[4]}`,
                    paddingLeft: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                })}
            >
                <Box sx={{ lineHeight: 1, fontSize: rem(12) }}>{label}</Box>
                <Box ml={10}>
                    <CategoryBadge small category={category} />
                </Box>
                <CloseButton onMouseDown={onRemove} variant="transparent" size={22} iconSize={14} tabIndex={-1} />
            </Box>
        </div>
    )
}

type BaseType = Omit<MultiSelectProps, "data" | "value" | "onChange"> | Omit<SelectProps, "data" | "value" | "onChange">

type CheckpointSelectProps = BaseType & {
    multiple?: boolean
    label?: string
    value: data.CheckpointId[]
    onChange: (values: data.CheckpointId[]) => void
}

export function CheckpointSelect(props: CheckpointSelectProps) {
    props = { multiple: false, ...props }

    const allCheckpoints = useMemo(
        () =>
            data.checkpoints
                .map((id) => ({
                    value: id,
                    label: data.getCheckpoint(id).checkpoint_name,
                    group: data.categoryNames[data.getCheckpoint(id).category],
                    category: data.getCheckpoint(id).category,
                }))
                .sort((a, b) => (a.group < b.group ? -1 : a.label < b.label ? -1 : 1)),
        [],
    )

    if (props.multiple) {
        return (
            <MultiSelect
                label={props.label ?? "Checkpoints"}
                searchable
                clearable
                nothingFound="No results"
                itemComponent={CheckpointSelectItem}
                valueComponent={CheckpointSelectValue}
                data={allCheckpoints}
                value={props.value}
                onChange={props.onChange as (values: string[]) => void}
                // FIXME: Dont' hardcode this
                miw={250}
            />
        )
    } else {
        return (
            <Select
                label={props.label ?? "Checkpoint"}
                searchable
                nothingFound="No results"
                itemComponent={CheckpointSelectItem}
                data={allCheckpoints}
                value={props.value[0]}
                onChange={(v) => props.onChange([v as data.CheckpointId])}
                // FIXME: Dont' hardcode this
                miw={250}
            />
        )
    }
}
