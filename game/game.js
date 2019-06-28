const bot = process.env["cli"] ? require("../discord/botStub.js") : require("../discord/bot.js");
const { Map } = require("./map.js");
const games = {};
const delay = 1000 * 10; // TODO: make configurable

class Game {
    constructor(message, testing) {
        let size = 20;

        this.delay = testing ? 0 : delay;
        this.message = message;
        this.map = new Map(size);

        for (let i = 0; i < 10; i++) {
            let map = new Map(size);

            if(map.board.length > this.map.board.length && map.board.length <= size * 2) {
                this.map = map;
            }
        }

        games[message.id] = this;
    }

    async step() {
        const [action] = await bot.getVotes(this);
        let cell = this.map.player;
        let result;

        switch (action) {
            case "north":
            case "east":
            case "south":
            case "west":
                if(cell.exits.includes(action)) {
                    result = `You moved ${action}.`;
                    this.map.player = cell = cell.getRelative(action);
                } else {
                    result = `You can't go ${action}.`;
                }
                break;
        }
        
        bot.write(this, cell.description + "\n\n" + result);
        this.step_clock = setTimeout(this.step.bind(this), this.delay);
    }

    start() {
        console.log("Game started.");
        
        bot.write(this, this.map.player.description);
        this.step_clock = setTimeout(this.step.bind(this), this.delay);
    }
}

function initialize(testing = false) {
    bot.on("new game", message => {
        new Game(message, testing).start();
    });
}

module.exports = { initialize };