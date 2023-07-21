import { describe, it, expect } from "vitest";
import { parseQuestSteps } from "../src/components/QuestLog";

describe("questLog", () => {
    const steps = [{
        "step": 76,
        "text": "Accept [@quest=Beat Bartleby] and beat [@mob=Bartleby], then turn in [@quest=Beat Bartleby]. Accept [@quest=Bartleby's Mug] from [@mob=Bartleby] and turn in [@quest=Bartleby's Mug] at the guy next to [@mob=Bartleby]. Accept [@quest=Marshal Haggard], leave Stormwind.",
        "coords": [-476.352499359657, 546.0755263225167]
    }];

    it("shows accepted and complete", () => {
        const stepQuestInfo = parseQuestSteps(steps, {});

        const beatQuest = stepQuestInfo[76].find((q) => q.name === "Beat Bartleby")!;
        const mugQuest = stepQuestInfo[76].find((q) => q.name === "Bartleby's Mug")!;
        const marshalQuest = stepQuestInfo[76].find((q) => q.name === "Marshal Haggard")!;

        expect(
            beatQuest.accepted && beatQuest.completed 
            && mugQuest.accepted && mugQuest.completed
            && marshalQuest.accepted && !marshalQuest.completed
        );
    });
});