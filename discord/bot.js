const discord = require("discord.js");
const events = require("events");
const emitter = module.exports = new events.EventEmitter();
const client = new discord.Client();
const actions = {
    "north:594388478108631040": "north",
    "east:594388477983064083": "east",
    "south:594388477987127296": "south",
    "west:594388478079270943": "west",
    "attack:594383579237056522": "attack",
    "take:594383579207696384": "take",
    "use:594383579228930068": "use",
    "drop:594383579048312843": "drop"
};
const numbers = {
    "1\u20e3": "1",
    "2\u20e3": "2",
    "3\u20e3": "3",
    "4\u20e3": "4",
    "5\u20e3": "5",
    "6\u20e3": "6",
    "7\u20e3": "7",
    "8\u20e3": "8",
    "9\u20e3": "9",
    "\ud83d\udd1f": "10"
};
const game_clients = {};

class Client {
    constructor(size, delay) {
        this.size = size;
        this.delay = delay;
    }

    async initialize(channel) {
        try {
            this.channel = channel;
            this.inv_message = await channel.send("Creating a new game... please be patient!");
            this.main_message = await channel.send("Creating a new game... please be patient!");

            // these can be done asynchronously but discord throttles to one
            // reaction at a time anyway, so we might as well do them in order
            await this.addReactions("inventory");
            await this.addReactions("main");

            this.status = `Game created! Taking first action in ${this.delay * 2} seconds...`;
            this.timer = setTimeout(this.step.bind(this), this.delay * 1000);
            
            game_clients[channel.id] = this;
            emitter.emit("new game", this, this.size);
        } catch (err) {
            console.error(err);
        }
    }

    async getVotedAction(message, set) {
        let votes = (await this.channel.fetchMessage(message.id)).reactions
            .filter((reaction, emoji) => set[emoji] && reaction.count > 1)
            .sort((a, b) => b.count - a.count);

        let clean_promise = Promise.all(votes.map(reaction => reaction.fetchUsers()))
            .then(this.cleanVotes.bind(this, votes));

        return [clean_promise, votes.map((reaction, emoji) => set[emoji])[0]];
    }

    async step() {
        if (this.done) { return; }

        let [clean_promise, action] = await this.getVotedAction(this.main_message, actions);
        let clean_set = [clean_promise];
        let item_num;

        if (action === "use" || action === "drop") {
            [clean_promise, item_num] = await this.getVotedAction(this.inv_message, numbers);
            clean_set.push(clean_promise);
        } else {
            // if we're not interacting with an item, we can clean the votes asynchronously
            this.getVotedAction(this.inv_message, numbers);
        }

        this.status = "Loading...";
        this.game.runTurn(action, item_num);

        await Promise.all(clean_set);
        this.timer = setTimeout(this.step.bind(this), this.delay * 1000);
    }

    async addReactions(message) {
        if (message === "main") {
            for (let emoji in actions) {
                await this.main_message.react(emoji);
            }
        } else {
            for (let number in numbers) {
                await this.inv_message.react(number);
            }
        }
    }

    async cleanVotes(votes) {
        let reaction_count = votes.reduce((count, reaction) => count + reaction.users.size - 1, 0);

        // remove individual users if there aren't too many
        if(reaction_count < 10) {
            await Promise.all(votes.map(
                async reaction => Promise.all(reaction.users.map(user => {
                    if(user !== client.user) {
                        return reaction.remove(user);
                    }
                }))
            ));
        } else {
            await this.main_message.clearReactions();
            await this.addReactions("main");
        }

        this.status = `Taking next action in ${this.delay} seconds...`;
        this.write();
    }

    writeInventory(text) {
        this.inv_message.edit("```\n" + text + "\n```");
    }

    write(text) {
        text = this.text = text || this.text;
        this.main_message.edit("```\n" + text + "\n```\n" + this.status);
    }

    destroy(message_a, message_b) {
        clearTimeout(this.timer);
        this.done = true;

        this.inv_message.clearReactions();
        this.inv_message.edit(message_a);

        this.main_message.clearReactions();
        this.main_message.edit(message_b);
    }
}

function postNewGame(channel, size, delay) {
    new Client(size, delay).initialize(channel);
}

function initialize() {
    client.login(process.env["BOT_TOKEN"]);

    client.on("ready", () => {
        console.log("Discord ready.");
    });

    client.on("message", message => {
        if(message.author.bot) { return; }

        let channel = message.channel;
        let current = game_clients[channel.id];
        let args = message.content.toLowerCase().split(" ");

        switch (args[0]) {
            case "z!start":
                if (message.channel.id === "594411460617175041") {
                    message.channel.send("Please use the #z9k channels for testing!");
                } else if (current) {
                    message.channel.send("A game is already running in this channel. Use !end to end it.")
                } else {
                    let size = parseInt(args[1] || 20);
                    let delay = parseInt(args[2] || 15);

                    if(isNaN(size) || +size < 5) {
                        message.channel.send("Size must be a whole number greater than or equal to 5.");
                        return;
                    }

                    if(isNaN(delay) || +delay < 5) {
                        message.channel.send("Delay must be a whole number greater than or equal to 5.");
                        return;
                    }

                    postNewGame(message.channel, size, delay);
                }
                break;

            case "z!end":
                if (current) {
                    current.game.lasthit = "bolt of lightning from the sky";
                    current.game.end();
                }
                break;

            case "z!help":
                message.channel.send("**Zorkotron 9000** is a procedurally generated text adventure bot. Any number of members can use reactions to vote on what action to take each turn. The goal is to roam through the dungeon, killing monsters and collecting valuables until you find the legendary Amulet of Wumpus. Use `z!start (map size) (delay)` to begin a new adventure. The default size is 20 (between 15 and 50 is recommended) and the default delay between actions is 15 seconds. Use `z!end` to end an ongoing game or `z!help` to view this message.\n\nGitHub link: https://github.com/Hydrothermal/zorkotron\nCreated by: Hydrothermal#1234, baz#1981, Nightfall9931.\nEmoji icons courtesy of https://icons8.com/.");
                break;
        }
    });
}

Object.assign(emitter, { initialize });