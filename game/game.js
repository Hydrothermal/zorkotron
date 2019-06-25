const bot = require("../discord/bot.js");
const games = {};
const delay = 1000 * 10; // TODO: make configurable

class Game {
    constructor(message) {
        this.message = message;

        games[message.id] = this;
    }

    step() {
        bot.getVotedAction(this);
        this.step_clock = setTimeout(this.step.bind(this), delay);
    }

    start() {
        console.log("Game started.");
        this.step_clock = setTimeout(this.step.bind(this), delay);
    }
}

function initialize() {
    bot.on("new game", message => {
        new Game(message).start();
    });
}

module.exports = { initialize };