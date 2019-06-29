const items = [
    ["a gold ring",         { type: "valuable", value: 4  }],
    ["a silver ring",       { type: "valuable", value: 6  }],
    ["a necklace",          { type: "valuable", value: 12 }],
    ["a ruby",              { type: "valuable", value: 25 }],
    ["a diamond",           { type: "valuable", value: 25 }],
    ["a sapphire",          { type: "valuable", value: 25 }],
    ["a small crystal",     { type: "valuable", value: 16 }],
    ["a sack of coins",     { type: "valuable", value: 18 }],
    ["a cold biscuit",      { type: "food",     value: 1, heal: 2 }],
    ["an old apple",        { type: "food",     value: 1, heal: 3 }],
    ["a potato",            { type: "food",     value: 1, heal: 3 }],
    ["an avocado",          { type: "food",     value: 5, heal: 5 }],
    ["a chocolate bar",     { type: "food",     value: 10, heal: 5 }],
    ["peanut brittle",      { type: "food",     value: 8, heal: 5 }],
    ["a slice of pie",      { type: "food",     value: 6, heal: 7 }],
    ["a turkey leg",        { type: "food",     value: 3, heal: 8 }],
    ["a loaf of bread",     { type: "food",     value: 3, heal: 8 }],
    ["a roasted rabbit",    { type: "food",     value: 8, heal: 9 }],
    ["a bowl of stew",      { type: "food",     value: 8, heal: 10 }]
];

class Item {
    constructor(game) {
        let [name, details] = items.random();

        this.game = game;
        this.name = name;

        Object.assign(this, details);
        this.description = `There is ${this.name} here (${this.type}).`;
    }

    use() {
        let game = this.game;
        
        if (this.type === "food") {
            game.hp = Math.min(game.maxhp, game.hp + this.heal);
            game.inventory.splice(game.inventory.indexOf(this), 1);
            game.results.push(`You ate ${this.name} and regained ${this.heal} hp.`);
        } else {
            game.results.push(`You can't use ${this.name}!`);
        }
    }

    get note() {
        let note;

        switch (this.type) {
            case "valuable":
                note = `worth ${this.value} gold`;
                break;

            case "food":
                note = `worth ${this.value} gold; heals for ${this.heal} hp`;
                break;
        }

        return `${this.name} (${note})`;
    }
}

module.exports = { Item };