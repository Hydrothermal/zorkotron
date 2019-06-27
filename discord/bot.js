const discord = require("discord.js");
const events = require("events");
const emitter = module.exports = new events.EventEmitter();
const client = new discord.Client();
const actions = {
    "\u2b05": "left",
    "\u2b06": "up",
    "\u27a1": "right",
    "\u2b07": "down",
    "\u2694": "attack"
};

async function getVotes(game) {
    let votes = game.message.reactions.filter(reaction => actions[reaction.emoji.name]).sort((a, b) => b.count - a.count);
    
    await Promise.all(
        votes.map(async reaction => {
            // remove all votes except the bot's
            await Promise.all(
                reaction.users.map(user => {
                    if (user !== client.user) { return reaction.remove(user); }
                })
            );
        })
    );

    return votes;
}

async function postNewGame(channel) {
    try {
        let message = await channel.send("Creating a new game...");

        // add action emojis
        for (let emoji in actions) {
            await message.react(emoji);
        }

        emitter.emit("new game", message);
        message.edit("Ready to play! Taking next action in 10 seconds...");
    } catch (err) {
        console.error(err);
    }
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

Object.assign(emitter, { initialize, getVotes });