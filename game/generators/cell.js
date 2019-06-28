const room_adjectives = ["cold", "dark", "spacious", "well-decorated"];

const room_fluff = {
    deco: [
        "A chandelier hangs from the ceiling.",
        "Armor stands are spaced along the walls.",
        "Armor stands are spaced along the walls.",
        "Empty sconces hang on the walls.",
        "Empty sconces hang on the walls.",
        "It was once painted, but has become faded with time.",
        "An old tapestry hangs from one wall.",
        "An old tapestry hangs from one wall.",
        "A large map is framed on the wall.",
    ],
    furniture: [
        "An upturned table lies on the floor.",
        "Candlesticks are scattered across the floor.",
        "Bones are scattered across the floor.",
        "A skull sits in the center of the room.",
        "An old, heavy table is in the center of the room.",
        "An old, heavy table is in the center of the room.",
        "A small table is in the center of the room.",
        "A table with a chair in front of it is against one wall.",
        "An empty chest sits near one wall.",
        "The remains of another adventurer are here.",
        "The remains of another adventurer are here.",
        "It's carpeted with a dirty, ratty rug.",
        "It looks like it might be a dining room.",
        "It looks like it might be a library.",
        "It looks like it might be a war room.",
    ],
    aesthetic: [
        "Small rats are scurrying about on the floor.",
        "Your boots squelch on the sticky floor.",
        "Cobwebs fill the corners.",
        "Cobwebs are all over the walls.",
        "The air smells damp and stagnant.",
        "The walls are blackened by a fire from long ago.",
        "It smells like old cheese.",
    ]
};

module.exports = function(cell) {
    let description = "";

    if(cell.type === "room") {
        description = `a ${room_adjectives.random()} room.`;

        for(let set in room_fluff) {
            if(Math.random() < 0.25) {
                description += " " + room_fluff[set].pullRandom();
            }
        }
    } else {
        // TODO: calculate hallway length
        description = "a hallway.";

        if(Math.random() < 0.25) {
            description += " " + room_fluff.aesthetic.pullRandom();
        }
    }

    return description;
};