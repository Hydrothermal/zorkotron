const { randRange, directions, direction_diffs, reverse } = require("../util.js");

class Cell {
    constructor(map, x, y, direction) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.direction = direction;

        // generate exits object
        this.exits = Object.fromEntries(directions.map(dir => [dir, false]));
    }

    connect(cell) {
        this.exits[cell.direction] = true;
        cell.exits[reverse(cell.direction)] = true;
    }

    getRelative(direction) {
        let [x_diff, y_diff] = direction_diffs[direction];
        return new Cell(this.map, this.x + x_diff, this.y + y_diff, direction);
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

        this.start = new Cell(this, 0, 0);
        this.start.direction = directions.random();
        carve(this.start, size);
    }

    get(x, y) {
        return this.board.find(cell => cell.is(x, y));
    }

    visualize() {
        let w = [], h = [];
        let output = "";

        this.board.forEach(cell => { w.push(cell.x); h.push(cell.y); });

        let x_min = Math.min(...w);
        let x_max = Math.max(...w);
        let y_min = Math.min(...h);
        let y_max = Math.max(...h);

        for (let y = y_min; y <= y_max; y++) {
            for (let x = x_min; x <= x_max; x++) {
                if (this.start.is(x, y)) {
                    output += "[+]";
                } else if (this.get(x, y)) {
                    output += "[ ]";
                } else {
                    output += "   ";
                }
            }

            output += "\n";
        }

        console.log(output);
    }
}

new Map(100).visualize();

module.exports = { Map };