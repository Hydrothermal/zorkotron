const { randRange } = require("../util.js");

const monsters = [
    {
        name: "zombie",
        description: "A zombie lurches uneasily towards you.",
        hp: 45,
        dodge: 0,
        hit_chance: 0.7,
        attack_str: "claws at you",
        miss_str: "swings at you, but misses",
        damage: [4, 7],
        death_str: "falls to the ground"
    },
    {
        name: "decaying zombie",
        description: "A decaying, wounded zombie stumbles at you.",
        hp: 25,
        dodge: 0,
        hit_chance: 0.5,
        attack_str: "claws at you",
        miss_str: "swings at you, but misses",
        damage: [3, 6],
        death_str: "falls to the ground"
    },
    {
        name: "skeleton",
        description: "A skeleton stands here, staring at you with empty eye sockets.",
        hp: 25,
        dodge: 0.15,
        hit_chance: 0.8,
        attack_str: "swings at you",
        miss_str: "swings at you, but misses",
        damage: [2, 3],
        death_str: "crumbles to dust"
    },
    {
        name: "skeleton warrior",
        description: "An armored skeleton menaces you with its rusty sword.",
        hp: 25,
        dodge: 0.25,
        hit_chance: 0.9,
        attack_str: "swings its sword at you",
        miss_str: "narrowly misses with its sword",
        damage: [5, 6],
        death_str: "crumbles to dust"
    },
    {
        name: "slime",
        colors: ["red", "green", "blue", "yellow", "orange", "purple", "pink"],
        init: function() { this.description = `A ${this.colors.random()} slime oozes slowly in your direction.`; },
        hp: 60,
        dodge: 0,
        hit_chance: 0.8,
        attack_str: "slaps you",
        miss_str: "wobbles around aimlessly",
        damage: [2, 3],
        death_str: "melts into the floor"
    },
    {
        name: "giant spider",
        description: "A fat spider, two feet across, skitters towards you.",
        hp: 20,
        dodge: 0.5,
        hit_chance: 0.6,
        attack_str: "bites you",
        miss_str: "leaps past you",
        damage: [8, 9],
        death_str: "falls on its back and curls up"
    },
    {
        name: "dire wolf",
        colors: ["grey", "white", "dark"],
        init: function() { this.description = `A massive, ${this.colors.random()}-furred wolf growls at you.`; },
        hp: 30,
        dodge: 0.1,
        hit_chance: 0.8,
        attack_str: "bites you",
        miss_str: "bites at you, but misses",
        damage: [6, 10],
        death_str: "slumps over and dies"
    },
    {
        name: "dire bat",
        description: "A large bat swoops at you, baring its teeth.",
        hp: 10,
        dodge: 0.6,
        hit_chance: 0.4,
        attack_str: "bites you",
        miss_str: "flaps around your head",
        damage: [2, 3],
        death_str: "drops to the ground and dies"
    }
];

class Monster {
    constructor(game, cell) {
        let details = monsters.random();

        this.game = game;
        this.cell = cell;
        Object.assign(this, details);

        if(this.init) { this.init(); }
    }

    attack() {
        if(Math.random() < this.hit_chance) {
            let damage = randRange(...this.damage);

            this.game.hp -= damage;
            this.game.results.push(`The ${this.name} ${this.attack_str} for ${damage} damage.`);
        } else {
            this.game.results.push(`The ${this.name} ${this.miss_str}.`);
        }
    }

    hit(damage) {
        if(Math.random() < this.dodge) {
            this.game.results.push(`You swing at the ${this.name}, but miss.`);
        } else {
            this.hp -= damage;
            this.game.results.push(`You hit the ${this.name} for ${damage} damage.`);

            if(this.hp <= 0) {
                this.die();
            }
        }
    }

    die() {
        this.cell.monsters.splice(this.cell.monsters.indexOf(this), 1);
        this.game.results.push(`The ${this.name} ${this.death_str}!`);
    }
}

module.exports = { Monster };