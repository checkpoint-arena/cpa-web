import React from "react"
import { Input, SegmentedControl } from "@mantine/core"

interface SegmentedInputProps {
    label: string
    value: string
    onChange(value: string): void
    data: Array<string> | Array<{ value: string; label: string }>
}

/**
 * A Mantine SegmentedControl with a label.
 */
export function SegmentedInput({ label, value, onChange, data }: SegmentedInputProps) {
    return (
        <Input.Wrapper label={label}>
            <div>
                <SegmentedControl value={value} data={data} onChange={onChange} />
            </div>
        </Input.Wrapper>
    )
}
