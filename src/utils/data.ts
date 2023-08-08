import assert from "assert"

import category_map from "@/../public/out/category_map.json"
import checkpoint_map from "@/../public/out/checkpoint_map.json"
import prompt_map from "@/../public/out/prompt_map.json"
import meta from "@/../public/out/meta_info.json"

export const seedOffset = 42
export const numSeeds = 6
export const allCategory = 'all'

export const imgSize = 1024
export const thumbSize = 256

export const allSeeds = Array.from(new Array(numSeeds), (_, i) => i + seedOffset)
Object.freeze(allSeeds)

export const genTime = meta.gen_time

export enum NegPrompt {
    None = "noneg",
    Default = "default",
    Sfw = "sfw",
}

export type CategoryId = keyof typeof category_map;
export const categories: Array<CategoryId | typeof allCategory> = [allCategory, ...Object.keys(category_map) as [CategoryId]]
Object.freeze(categories)
export const categoryNames: { [key in (CategoryId | typeof allCategory)]: string } = {
    // TODO: Figure out how to do this programmatically (using Object.fromEntries?)
    photo: "Photo",
    other: "Other",
    anime: "Anime",
    all: "All"
}
Object.freeze(categoryNames)

export type CheckpointId = keyof typeof checkpoint_map
export const checkpoints = Object.keys(checkpoint_map) as Array<CheckpointId>
Object.freeze(checkpoints)

export type PromptId = keyof typeof prompt_map
export const prompts = Object.keys(prompt_map) as Array<PromptId>
Object.freeze(prompts)

interface Checkpoint {
    checkpoint: CheckpointId | "unknown";
    checkpoint_name: string;
    category: CategoryId
    url: string
}

export class ImageId {
    checkpointId: CheckpointId
    promptId: PromptId
    negPrompt: NegPrompt
    seed: number

    constructor(checkpointId: CheckpointId, promptId: PromptId, negPrompt: NegPrompt, seed: number) {
        this.checkpointId = checkpointId
        this.promptId = promptId
        this.negPrompt = negPrompt
        this.seed = seed
    }

    static parseIdString(idString: string) {
        let components = idString.split('_')
        let i = 0
        const pid = components[i++]
        const cid = components[i++]
        let negPrompt = NegPrompt.Default
        if (components[i] == NegPrompt.Sfw.toString()) {
            negPrompt = NegPrompt.Sfw
            i++
        } else if (components[i] == NegPrompt.None.toString()) {
            negPrompt = NegPrompt.None
            i++
        }
        const seed = parseInt(components[i++]) + seedOffset - 1
        return new ImageId(cid as CheckpointId, pid as PromptId, negPrompt, seed)
    }

    get idString() {
        let negPromptString = ''
        if (this.negPrompt != NegPrompt.Default) {
            negPromptString = this.negPrompt.toString() + '_'
        }
        return `${this.promptId}_${this.checkpointId}_${negPromptString}${(this.seed - seedOffset + 1).toString().padStart(5, '0')}`
    }

    get checkpoint() {
        return getCheckpoint(this.checkpointId)
    }

    get prompt() {
        return getPrompt(this.promptId)
    }

    get path() {
        return `/avif/${this.idString}.avif`
    }

    get thumbPath() {
        return `/avif/thumb/${this.idString}.avif`
    }

    get negPromptDisplay() {
        if (this.negPrompt != NegPrompt.Default) {
            return `(${this.negPrompt.toString()})`
        }
        return ''
    }

    get advancedUrlForPrompt() {
        return "/advanced?prompts=" + this.promptId + "&neg=" + this.negPrompt + "&cps=" + checkpoints
    }
}

// query

export function selectImages(
    selectedCheckpoints: CheckpointId[] = checkpoints,
    selectedPrompts: PromptId[] = prompts,
    selectedNegPrompt: NegPrompt[] = [NegPrompt.None, NegPrompt.Default, NegPrompt.Sfw],
    selectedSeeds: number[] = allSeeds
) {
    return selectedCheckpoints.flatMap((checkpointId) => {
        return selectedPrompts.flatMap((promptId) => {
            return selectedNegPrompt.flatMap((negPrompt) => {
                return selectedSeeds.flatMap((seed) => {
                    return new ImageId(checkpointId, promptId, negPrompt, seed)
                })
            })
        })
    })
}

// data retrieval

function isKeyof<T extends object>(obj: T, possibleKey: keyof any): possibleKey is keyof T {
    return possibleKey in obj
}

export function getCheckpoint(id: CheckpointId): Checkpoint {
    if (!isKeyof(checkpoint_map, id)) return { checkpoint: "unknown", checkpoint_name: "Error: Unknown Checkpoint", category: "other", url: "" }
    return checkpoint_map[id] as Checkpoint
}

export function getCheckpoints(category: CategoryId | typeof allCategory = allCategory) {
    if (category == allCategory) return checkpoints
    if (!isKeyof(category_map, category)) return []
    return category_map[category] as Array<CheckpointId>
}

export function getPrompt(prompt_id: string) {
    if (!isKeyof(prompt_map, prompt_id)) return "Unknown Checkpoint"
    return prompt_map[prompt_id]
}

export const negativePromptOptions = [
    { value: NegPrompt.None, label: "None", },
    { value: NegPrompt.Default, label: "Default", },
    { value: NegPrompt.Sfw, label: "SFW", },
];

export const totalImages = checkpoints.length * prompts.length * Object.keys(NegPrompt).length * numSeeds
assert(totalImages == meta.total_imgs, "Generated image count mismatch")

// random selection

function getRandomElement(arr: any[]) {
    return arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined
}

export function getRandomCheckpointId() {
    return getRandomElement(checkpoints)
}
export function getRandomPromptId() {
    return getRandomElement(prompts)
}
