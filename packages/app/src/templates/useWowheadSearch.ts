import useFetch from "./useFetch";
import _ from "lodash";

interface WowheadSearchResults {
    search: string;
    results: Array<WowheadSearchResult>
}

interface WowheadSearchResult {
    type?: number;
    id: number;
    name?: string;
    typeName?: "Quest" | "Spell" | "NPC" | "Skill" | "Item";
    popularity?: number;
    rank?: string;
    icon?: string;
    side?: number;
}

type TypeName = "quest" | "spell" | "npc" | "skill" | "item" | string;

const searchResults: {[key: TypeName]: Record<string, WowheadSearchResult>} = {
    quest: {}, spell: {}, npc: {}, skill: {}, item: {}
};

export const useWowheadSearch = (query: string, typeName: TypeName): WowheadSearchResult => {
    const { data, error } = useFetch<WowheadSearchResults>(`/search/suggestions-template?q=${query}`, {method: "GET"});
    
    if (!error && searchResults[typeName][query]) {
        return searchResults[typeName][query];
    } else if (data && !searchResults[typeName][query]) {
        let match: WowheadSearchResult | undefined = undefined;
        if (typeName === "quest" || typeName === "npc" || typeName === "skill" || typeName === "item") {
            match = data.results.find((res) => {
                return res.typeName!.toLowerCase() === typeName && res.name!.toLowerCase() === query.toLowerCase();
            });
        }
        if (typeName === "spell") {
            const filteredResults = _.filter(data.results, (res) => res.typeName === "Spell")
            const matches = _.sortBy(filteredResults, (res) => res.id);
            if (matches.length > 0) {
                if (matches[0].rank && matches[0].rank !== "Rank 1") {
                    match = _.find(matches, (match) => match.rank === "Rank 1");
                } else {
                    match = matches[0];
                }
            }
        }
        if (match) {
            searchResults[typeName][query] = match;
        }
    }
    return searchResults[typeName][query];
};

export default useWowheadSearch;