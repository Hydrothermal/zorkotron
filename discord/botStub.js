const keypress = require("keypress");
const { EventEmitter } = require("events");
const emitter = new EventEmitter();

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

class Client {
    constructor() {
        emitter.emit("new game", this);
    }

    getVotes() {
        return new Promise(resolve => {
            console.log("Press a key:");

            process.stdin.once("keypress", function (ch, key) {
                let action;

                if (key && key.ctrl & key.name === "c") { process.exit(0); }
                
                switch (key.name) {
                    case "up":
                        action = "north";
                        break;

                    case "right":
                        action = "east";
                        break;

                    case "down":
                        action = "south";
                        break;

                    case "left":
                        action = "west";
                        break;

                    case "a":
                        action = "attack";
                        break;

                    case "t":
                        action = "take";
                        break;
                }

                if (action) {
                    resolve([action]);
                } else {
                    resolve(getVotes());
                }
            });
        });
    }

    writeInventory(text) {
        console.log("\x1b[2J");
        console.log(text);
    }

    write(text) {
        console.log("------------------------------");
        console.log(text);
    }
}

function initialize() {
    new Client();
}

module.exports = Object.assign(emitter, { initialize });