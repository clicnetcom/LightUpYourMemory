export declare global {
    type GameType = 'single' | 'time-attack' | 'single-ai' | 'multiplayer'
    type Player = {
        uid: string
        name: string
    }
    type Game = {
        id: string
        type: GameType
        deck?: string
        opponent?: Player
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
        createAt: number
        p1: Player
        p2?: Player
        deck: string
        opponent?: string
        password?: string
    }

}