const bot = process.env["cli"] ? require("../discord/botStub.js") : require("../discord/bot.js");
const { Map } = require("./map.js");
const { joinList } = require("../util.js");
const games = {};
const delay = 1000 * 10; // TODO: make configurable

class Game {
    constructor(message, testing) {
        let size = 20;

        this.delay = testing ? 0 : delay;
        this.message = message;
        this.inventory = [];
        this.results = [];
        this.map = new Map(size);

        for (let i = 0; i < 10; i++) {
            let map = new Map(size);

            if(map.board.length > this.map.board.length && map.board.length <= size * 2) {
                this.map = map;
            }
        }

        this.map.populate();
        games[message.id] = this;
    }

    step() {
        let cell = this.map.player;
        let description = [
            this.map.visualize(),
            `You are standing in ${cell.description}.`
        ];

        // TODO: write out current inventory

        if (cell.items.length > 0) {
            description.push(
                cell.items.map(item => `There is ${item.name} here (${item.type}).`).join("\n")
            );
        }

        if (cell.monsters.length > 0) {
            description.push(
                cell.monsters.map(monster => monster.description).join("\n")
            );
        }

        description.push(`Exits: ${cell.exits.join(", ")}.`, this.results.join("\n"));
        bot.write(this, description.join("\n\n"));

        this.step_clock = setTimeout(this.runTurn.bind(this), this.delay);
        this.results = [];
    }

    async runTurn() {
        const [action] = await bot.getVotes(this);
        let cell = this.map.player;

        switch (action) {
            case "north":
            case "east":
            case "south":
            case "west":
                if(cell.exits.includes(action)) {
                    this.results.push(`You moved ${action}.`);
                    this.map.player = cell = cell.getRelative(action);
                } else {
                    this.results.push(`You can't go ${action}.`);
                }
                break;

            case "take":
                if(cell.items.length > 0) {
                    this.results.push(`You took ${joinList(cell.items.map(item => item.name))}.`);
                    this.inventory.push(...cell.items);
                    cell.items = [];
                } else {
                    this.results.push("There isn't anything to pick up here.");
                }
                break;
        }

        this.step();
    }

    start() {
        console.log("Game started.");
        this.step();
    }
}

function initialize(testing = false) {
    bot.on("new game", message => {
        new Game(message, testing).start();
    });
}

module.exports = { initialize };