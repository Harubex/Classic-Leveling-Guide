export const questName = /(?<!complete|take|drop|abandon)\s\[@quest=([\w\s\'\+\=!\-\.,":\?]+)#(\d+)(?:\&([a-z\s]+))?(?:\&([0-9a-z\s]+))?\]/gi;
export const questState = /(accept|turn in)/gi;
export const entityMatches = /\[@(quest|mob|money|move|skill|item)=([\w\s\'\+\=!\-\.,":\?]+)#?(\d*)\]/gi;
export const renamedEntityMatches = /\[@(quest|npc|money|spell|skill|item)=([\w\s\'\+\=!\-\.,":\?]+)#?(\d*)(?:\&([a-z\s]+))?(?:\&([0-9a-z\s]+))?\]/gi;
export default {
    questName, questState, entityMatches, renamedEntityMatches
};
