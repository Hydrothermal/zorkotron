const directions = ["north", "east", "south", "west"];
const direction_diffs = {
    "north": [0, -1],
    "east":  [+1, 0],
    "south": [0, +1],
    "west":  [-1, 0]
};

Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
};

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reverse(direction) {
    switch (direction) {
        case "north":
            return "south";
            break;
            
        case "east":
            return "west";
            break;
            
        case "south":
            return "north";
            break;
            
        case "west":
            return "east";
            break;
    }
}

module.exports = { randRange, directions, direction_diffs, reverse };