import { describe, it, expect } from "vitest";
import { parseQuestSteps } from "../src/components/QuestLog";

describe("questLog", () => {
    const steps = [{
        "step": 1,
        "text": "Accept [@quest=A Threat Within]. Delete your [@item=Hearthstone].",
        "macros": [{
            "title": "Heroic Strike Macro",
            "text": "#showtooltip\n/startattack\n/cast Heroic Strike\n/stopcasting",
            "class": "warrior"
        }],
        "coords": [-485.875, 561.84375]
    }, {
        "step": 2,
        "text": "Kill wolves, get [@money=10c] worth of trash (1-2 kills), vendor, go inside the abbey and turn in [@quest=A Threat Within].",
        "coords": [-484.8125, 561.78125],
        "special": "warrior"
    }, {
        "step": 3,
        "text": "Accept [@quest=Kobold Camp Cleanup], walk right to Warrior trainer, train [@move=Battle Shout]. Go out, accept [@quest=Eagan Peltskinner], walk over to [@mob=Eagan Peltskinner] and turn in [@quest=Eagan Peltskinner]. Accept [@quest=Wolves Across the Border] and kill [@mob=Young Wolf]/[@mob=Kobold Vermin] as spawns permit. Focus on vermin. Kill other mobs while waiting.",
        "coords": [-481.4375, 562.9375]
    }];

    it("shows accepted and complete", () => {
        const stepQuestInfo = parseQuestSteps(steps);
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