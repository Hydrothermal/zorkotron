const room_adjectives = ["cold", "dark", "spacious", "decorated"];
const hallway_adjectives = room_adjectives.concat(["narrow", "wide"]);

module.exports = function(cell) {
    let description = "";

    if(cell.type === "room") {
        description = `a ${room_adjectives.random()} room`;
    } else {
        // TODO: calculate hallway length
        description = `a ${hallway_adjectives.random()} hallway`;
    }

    return description;
};