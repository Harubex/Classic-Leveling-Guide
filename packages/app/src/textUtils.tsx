import regex from "@shared/regex";
import { Quests, Mobs, Moves, Money, Items, Skills, TemplateProps } from "./components/links";
import { LatLngExpression } from "leaflet";

const templates: {[name: string]: React.FC<TemplateProps>} = {
    quest: Quests,
    npc: Mobs,
    spell: Moves,
    skill: Skills,
    item: Items,
}

export const transposeTextEntities = (text: string = ""): React.ReactNode[] => {
    let chunks: React.ReactNode[] = [];
    let lastMatchIndex = 0;
    for (const match of text.matchAll(regex.renamedEntityMatches)) {
        const [matchedText, templateType, templateText, templateId] = match;
        const matchIndex = match.index!;
        chunks.push(text.substring(lastMatchIndex, matchIndex));
        switch (templateType) {
            case "money":
                chunks.push(<Money>{templateText}</Money>);
                break;
            default:
                const Element = templates[templateType];
                if (Element) {
                    chunks.push(
                        <Element id={Number(templateId)}>
                            {templateText}
                        </Element>
                    );
                }
                break;
        }
        lastMatchIndex = matchIndex + matchedText.length;
    }
    chunks.push(text.substring(lastMatchIndex));
    if (chunks.length === 0) {
        return [text];
    }
    return chunks;
};

export const convertCoords = (coords: number[] | number[][]) => {
    return (Array.isArray(coords[0]) ? coords : [coords]) as LatLngExpression[];
};

