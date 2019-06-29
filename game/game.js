const bot = process.env["cli"] ? require("../discord/botStub.js") : require("../discord/bot.js");
const { Map } = require("./map.js");
const { joinList, randRange } = require("../util.js");
const games = [];

class Game {
    constructor(client) {
        let size = 20;

        this.client = client;
        this.inventory = [];
        this.results = [];
        this.map = new Map(this, size);

        for (let i = 0; i < 10; i++) {
            let map = new Map(this, size);

            if(map.board.length > this.map.board.length && map.board.length <= size * 2) {
                this.map = map;
            }
        }

        this.level = Math.floor(this.map.board.length / 5);
        this.hp = this.maxhp = 25 + this.level * 3;
        this.map.populate();

        client.game = this;
        games.push(this);

        this.step();
    }

    step() {
        if(this.hp <= 0) {
            this.end();
        } else {
            let cell = this.map.player;
            let inventory = ["Your inventory:"];
            let description = [
                `You are a level ${this.level} adventurer. Current HP: ${this.hp}/${this.maxhp}`,
                `You are standing in ${cell.description}`
            ];

            if(process.env["cli"]) {
                description.unshift(this.map.visualize());
            }

            if(this.inventory.length > 0) {
                inventory.push(...this.inventory.map((item, i) => `${i + 1}) ${item.note}`))
            } else {
                inventory.push("Your inventory is empty.");
            }

            if (cell.items.length > 0) {
                description.push(
                    cell.items.map(item => item.description).join("\n")
                );
            }

            if (cell.monsters.length > 0) {
                description.push(
                    cell.monsters.map(monster => monster.description).join("\n")
                );
            }

            description.push(`Exits: ${cell.exits.join(", ")}.`, this.results.join("\n"));
            this.client.writeInventory(inventory.join("\n"));
            this.client.write(description.join("\n\n"));

            this.results = [];
        }
    }

    async runTurn(action, item_num) {
        let cell = this.map.player;
        let item;

        switch (action) {
            case "north":
            case "east":
            case "south":
            case "west":
                if(cell.exits.includes(action)) {
                    let monsters = cell.monsters;

                    this.results.push(`You moved ${action}.`);
                    this.map.player = cell = cell.getRelative(action);

                    monsters.forEach(monster => monster.followTo(cell));
                } else {
                    this.results.push(`You can't go ${action}.`);
                }
                break;

            case "attack":
                if(cell.monsters.length > 0) {
                    let monster = cell.monsters[0];
                    
                    // 3d6 damage
                    monster.hit(randRange(1, 6) + randRange(1, 6) + randRange(1, 6));
                } else {
                    this.results.push("You swing around at the air!");
                }
                break;

            case "take":
                if(cell.items.length > 0) {
                    if(this.inventory.length + cell.items.length > 10) {
                        // TODO: take enough items to fill inventory
                        this.results.push("You don't have enough room in your inventory.");
                    } else {
                        this.results.push(`You took ${joinList(cell.items.map(item => item.name))}.`);
                        this.inventory.push(...cell.items);

                        if(cell.items.find(item => item.name === "The Amulet of Wumpus")) {
                            this.end(true);
                            return;
                        }

                        cell.items = [];
                    }
                } else {
                    this.results.push("There isn't anything to pick up here.");
                }
                break;

            // items
            case "use":
                item = this.inventory[item_num - 1];

                if (item) {
                    item.use();
                } else {
                    this.results.push(`You don't have an item in slot ${item_num}.`);
                }
                break;

            case "drop":
                item = this.inventory[item_num - 1];

                if (item) {
                    cell.items.push(this.inventory.splice(this.inventory.indexOf(item), 1)[0]);
                    this.results.push(`You dropped ${item.name}.`);
                } else {
                    this.results.push(`You don't have an item in slot ${item_num}.`);
                }
                break;
        }

        cell.monsters.forEach(monster => monster.attack());

        this.step();
    }

    end(win) {
        let gold = this.inventory.filter(item => item.type === "valuable").reduce((sum, item) => sum + item.amount, 0);
        let summary = `You were a level ${this.level} adventurer carrying ${gold} gold worth of items.`;

        if(win) {
            this.client.destroy("You won!", `You have recovered the Amulet of Wumpus. ${summary}`);
        } else {
            this.client.destroy("Game over.", `You lost. ${summary}`);
        }
    }
}

function initialize() {
    bot.on("new game", client => {
        new Game(client);
    });
}

module.exports = { initialize };