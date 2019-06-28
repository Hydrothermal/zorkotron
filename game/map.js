const { randRange, directions, direction_diffs, reverse } = require("../util.js");
const { Item } = require("./items.js");
const generate = require("./generate.js");

class Cell {
    constructor(map, x, y, direction) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.exits = [];
        this.items = [];
    }

    connect(cell) {
        this.exits.push(cell.direction);
        cell.exits.push(reverse(cell.direction));
    }

    getRelative(direction, distance) {
        let [x_diff, y_diff] = direction_diffs[direction];
        let x = this.x + x_diff * (distance || 1);
        let y = this.y + y_diff * (distance || 1);

        if(this.map.ready) {
            return this.map.get(x, y);
        }

        return new Cell(this.map, x, y, direction);
    }

    is(x, y) {
        return this.x === x && this.y === y;
    }

    get neighbors() {
        let neighbors = directions.map(dir => this.getRelative(dir));

        return neighbors;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

function carve(cell, limit) {
    let map = cell.map;
    let straight = cell.getRelative(cell.direction);
    let free = cell.neighbors.filter(n => !map.get(n.x, n.y));
    let next;

    if(limit === 1 || cell === map.start || Math.random() < 0.1) {
        cell.type = "room";
    } else {
        cell.type = "hallway";
    }

    map.board.push(cell);

    if (free.length > 0 && (!limit || --limit > 0)) {
        if (Math.random() < 0.75 && !map.get(straight.x, straight.y)) {
            next = straight;
        } else {
            next = free.random();
        }

        cell.connect(next);
        carve(next, limit);

        free = free.filter(c => c.direction !== next.direction);

        if (limit >= 5 && free.length > 0 && Math.random() < 0.1) {
            next = free.random();
            cell.connect(next);

            carve(
                next,
                [randRange(1, 3), randRange(1, 6), randRange(5, 20)].random()
            );
        }
    }
}

class Map {
    constructor(size) {
        this.size = size;
        this.board = [];

        this.player = this.start = new Cell(this, 0, 0);
        this.start.direction = directions.random();
        
        carve(this.start, size);
        this.ready = true;
    }

    populate() {
        this.board.forEach(cell => {
            // sort exits in NESW order
            cell.exits = cell.exits.sort((a, b) => directions.indexOf(a) - directions.indexOf(b));
            cell.description = generate.cell(cell);

            for (let i = 0; i < 2; i++) {
                if (Math.random() < 0.1) {
                    cell.items.push(new Item());
                }
            }
        });
    }

    get(x, y) {
        return this.board.find(cell => cell.is(x, y));
    }

    visualize() {
        let w = [], h = [];
        let output = [];
        let row;

        this.board.forEach(cell => { w.push(cell.x); h.push(cell.y); });

        let x_min = Math.min(...w);
        let x_max = Math.max(...w);
        let y_min = Math.min(...h);
        let y_max = Math.max(...h);

        for (let y = y_min; y <= y_max; y++) {
            row = [];
            output.push(row);

            for (let x = x_min; x <= x_max; x++) {
                let cell = this.get(x, y);
                let block;

                if (cell) {
                    block = [];

                    if(cell.exits.includes("north")) { block.push("/  \\"); } else { block.push("/--\\"); }
                    if(cell.exits.includes("west")) { block.push(" "); } else { block.push("|"); }
                    if(cell.items.length > 0) { block[1] += "i"; } else { block[1] += " "; }
                    if(cell.exits.includes("east")) { block[1] += "  "; } else { block[1] += " |"; }
                    if(cell.exits.includes("south")) { block.push("\\  /"); } else { block.push("\\--/"); }
                } else {
                    block = ["    ", "    ", "    "];
                }

                if (this.player.is(x, y)) {
                    block = block.map(str => `\x1b[36m${str}\x1b[0m`);
                }

                row.push(block);
            }
        }

        return this.board.length + "\n\n" + output.map(row => {
            return row.map(cell => cell[0]).join("") + "\n" +
                row.map(cell => cell[1]).join("") + "\n" +
                row.map(cell => cell[2]).join("");
        }).join("\n");
    }
}

module.exports = { Map };