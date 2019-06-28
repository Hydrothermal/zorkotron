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
    ["an avocado",          { type: "food", amount: 4, usable: true }],
    ["a chocolate bar",     { type: "food", amount: 4, usable: true }],
    ["peanut brittle",      { type: "food", amount: 4, usable: true }],
    ["a slice of pie",      { type: "food", amount: 5, usable: true }],
    ["a turkey leg",        { type: "food", amount: 6, usable: true }],
    ["a loaf of bread",     { type: "food", amount: 6, usable: true }],
    ["a roasted rabbit",    { type: "food", amount: 6, usable: true }],
    ["a bowl of stew",      { type: "food", amount: 8, usable: true }]
];

class Item {
    constructor() {
        let [name, details] = items.random();

        this.name = name;
        Object.assign(this, details);
    }

    use() {
        if (this.type === "food") {
            // heal for this.amount
        }
    }

    get description() {
        let note;

        switch (this.type) {
            case "valuable":
                note = `sells for ${this.amount}`;
                break;

            case "food":
                note = `heals for ${this.amount}`;
                break;
        }

        return `${this.name} (${note})`;
    }
}

module.exports = { Item };