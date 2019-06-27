const bot = process.env["cli"] ? require("../discord/botStub.js") : require("../discord/bot.js");
const games = {};
const delay = 1000 * 10; // TODO: make configurable

class Game {
    constructor(message, testing) {
        this.delay = testing ? 0 : delay;
        this.message = message;
        games[message.id] = this;
    }

    async step() {
        const [action] = await bot.getVotes(this);
        this.step_clock = setTimeout(this.step.bind(this), this.delay);
    }

    start() {
        console.log("Game started.");
        this.step_clock = setTimeout(this.step.bind(this), this.delay);
    }
}

function initialize(testing = false) {
    bot.on("new game", message => {
        new Game(message, testing).start();
    });
}

module.exports = { initialize };