const items = [
    ["a gold ring",         { type: "valuable", amount: 4  }],
    ["a silver ring",       { type: "valuable", amount: 6  }],
    ["a necklace",          { type: "valuable", amount: 12 }],
    ["a ruby",              { type: "valuable", amount: 25 }],
    ["a diamond",           { type: "valuable", amount: 25 }],
    ["a sapphire",          { type: "valuable", amount: 25 }],
    ["a small crystal",     { type: "valuable", amount: 16 }],
    ["a sack of coins",     { type: "valuable", amount: 18 }],
    ["a cold biscuit",      { type: "food", amount: 2, usable: true }],
    ["an old apple",        { type: "food", amount: 3, usable: true }],
    ["a potato",            { type: "food", amount: 3, usable: true }],
    ["an avocado",          { type: "food", amount: 5, usable: true }],
    ["a chocolate bar",     { type: "food", amount: 5, usable: true }],
    ["peanut brittle",      { type: "food", amount: 5, usable: true }],
    ["a slice of pie",      { type: "food", amount: 7, usable: true }],
    ["a turkey leg",        { type: "food", amount: 8, usable: true }],
    ["a loaf of bread",     { type: "food", amount: 8, usable: true }],
    ["a roasted rabbit",    { type: "food", amount: 9, usable: true }],
    ["a bowl of stew",      { type: "food", amount: 10, usable: true }]
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
            game.hp = Math.min(game.maxhp, game.hp + this.amount);
            game.inventory.splice(game.inventory.indexOf(this), 1);
            game.results.push(`You ate ${this.name} and regained ${this.amount} hp.`);
        } else {
            game.results.push(`You can't use ${this.name}!`);
        }
    }

    get note() {
        let note;

        switch (this.type) {
            case "valuable":
                note = `worth ${this.amount} gold`;
                break;

            case "food":
                note = `heals for ${this.amount} hp`;
                break;
        }

        return `${this.name} (${note})`;
    }
}

module.exports = { Item };