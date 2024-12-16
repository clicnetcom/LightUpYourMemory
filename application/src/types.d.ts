export declare global {
    type GameType = 'single' | 'time-attack' | 'single-ai' | 'multiplayer'
    type Game = {
        id: string
        type: GameType
        deck?: string
    }

}