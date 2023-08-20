declare interface WowheadSearchResults {
    search: string;
    results: WowheadSearchResult[]
}

declare interface WowheadSearchResult {
    type?: number;
    id: number;
    name?: string;
    typeName?: "Quest" | "Spell" | "NPC" | "Skill" | "Item";
    popularity?: number;
    rank?: string;
    icon?: string;
    side?: number;
}

declare type TypeName = "quest" | "spell" | "npc" | "skill" | "item" | string;