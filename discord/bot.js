const discord = require("discord.js");
const events = require("events");
const emitter = module.exports = new events.EventEmitter();
const client = new discord.Client();
const actions = {
    "\u2b06": "north",
    "\u27a1": "east",
    "\u2b07": "south",
    "\u2b05": "west",
    "\u2694": "attack",
    "\ud83d\udec4": "take"
};

const numbers = ["1\u20e3", "2\u20e3", "3\u20e3", "4\u20e3", "5\u20e3", "6\u20e3", "7\u20e3", "8\u20e3", "9\u20e3", "\ud83d\udd1f"];

class Client {
    async initialize(channel) {
        try {
            this.inv_message = await channel.send("Creating a new game...");
            this.main_message = await channel.send("Creating a new game...");
            
            // these can be done asynchronously but discord throttles to one
            // reaction at a time anyway, so we might as well do them in order
            await this.addReactions("inventory");
            await this.addReactions("main");

            emitter.emit("new game", this);
        } catch (err) {
            console.error(err);
        }
    }

    async getVotes() {
        let votes = this.main_message.reactions
            .filter((reaction, emoji) => actions[emoji] && reaction.count > 1)
            .sort((a, b) => b.count - a.count)
            .map((reaction, emoji) => actions[emoji]);
        
        // TODO: remove one at a time if there are few enough reactions it's more efficient
        await this.main_message.clearReactions().catch(err => { });
        // TODO: re-add after stepping instead of before
        await this.addReactions("main");

        return votes;
    }

    async addReactions(message) {
        if (message === "main") {
            for (let emoji in actions) {
                await this.main_message.react(emoji);
            }
        } else {
            for (let i = 0; i < numbers.length; i++) {
                await this.inv_message.react(numbers[i]);
            }
        }
    }

    writeInventory(text) {
        this.inv_message.edit("```\n" + text + "\n```");
    }

    write(text) {
        this.main_message.edit("```\n" + text + "\n```");
    }
}

function postNewGame(channel) {
    new Client().initialize(channel);
}

function initialize() {
    client.login(process.env["BOT_TOKEN"]);

    client.on("ready", () => {
        console.log("Discord ready.");
        postNewGame(client.guilds.get("473707290084507659").channels.get("473707290084507663"));
    });

    client.on("message", message => {
        switch (message.content) {
            case "!start":
                postNewGame(message.channel);
                break;

            case "!end":
                // end ongoing game
                break;
        }
    });
}

Object.assign(emitter, { initialize });