import type { Vote } from "./vote"

export interface Idea {
    id: string

    title: string
    description?: string

    votes: Vote[] | number

    createdAt: string
    updatedAt: string
}
