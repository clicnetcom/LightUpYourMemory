export declare global {
    type GameType = 'single' | 'time-attack' | 'single-ai' | 'multiplayer'
    type Player = {
        uid: string
        name?: string
    }
    type DeckType = 'string' | 'image'
    type Deck = {
        id: string
        title: string
        description: string
        type: DeckType
        cards: string[]
    }
    type Achievement = {
        id: string
        title: string
        icon: string
        condition: string
    }
    type Match = {
        id: string
        type: GameType
        p1: Player
        p2?: Player
        deck?: string
        password?: string
        turn?: string
        board?: CardState[],
        chat?: string[]
        p1Score?: number
        p2Score?: number
        isComplete?: boolean
        winner?: string | null
    }
    type CardState = {
        id: number
        value: string
        isFlipped: boolean
        isMatched: boolean
    }
}