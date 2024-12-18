export declare global {
    type GameType = 'single' | 'time-attack' | 'single-ai' | 'multiplayer'
    type Game = {
        id: string
        type: GameType
        deck?: string
        opponent?: string
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

}