const keypress = require("keypress");
const { EventEmitter } = require("events");
const emitter = new EventEmitter();

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

class Client {
    constructor() {
        process.stdin.on("keypress", (ch, key) => {
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
                this.game.runTurn(action);

                if (!this.done) {
                    console.log("Press a key:");
                }
            } else {
                console.log("Press a key:");
            }
        });
        
        emitter.emit("new game", this);
    }

    writeInventory(text) {
        console.log("\x1b[2J");
        console.log(text);
    }

    write(text) {
        console.log("------------------------------");
        console.log(text);
    }

    destroy(message_a, message_b) {
        this.done = true;
        this.writeInventory(`${message_a}\n\n${message_b}`)
        process.stdin.pause();
    }
}

function initialize() {
    new Client();
}

module.exports = Object.assign(emitter, { initialize });