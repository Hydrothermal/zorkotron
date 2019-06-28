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
const delay = 1000 * 10; // TODO: make configurable

class Client {
    async initialize(channel) {
        try {
            this.channel = channel;
            this.inv_message = await channel.send("Creating a new game...");
            this.main_message = await channel.send("Creating a new game...");
            
            // these can be done asynchronously but discord throttles to one
            // reaction at a time anyway, so we might as well do them in order
            await this.addReactions("inventory");
            await this.addReactions("main");

            this.status = "Game created! Taking next action in 10 seconds...";
            emitter.emit("new game", this);
            setTimeout(this.getVotes.bind(this), delay);
        } catch (err) {
            console.error(err);
        }
    }

    async getVotes() {
        let votes = (await this.channel.fetchMessage(this.main_message.id)).reactions
            .filter((reaction, emoji) => actions[emoji] && reaction.count > 1)
            .sort((a, b) => b.count - a.count);
        let action = votes.map((reaction, emoji) => actions[emoji])[0];
        
        this.status = "Loading...";
        this.game.runTurn(action);

        await Promise.all(votes.map(reaction => reaction.fetchUsers()));
        this.cleanVotes(votes);
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
            await this.main_message.clearReactions().catch(err => { });
            await this.addReactions("main");
        }

        this.status = "Taking next action in 10 seconds...";
        this.write();

        setTimeout(this.getVotes.bind(this), delay);
    }

    writeInventory(text) {
        this.inv_message.edit("```\n" + text + "\n```");
    }

    write(text) {
        text = this.text = text || this.text;
        this.main_message.edit("```\n" + text + "\n```\n" + this.status);
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