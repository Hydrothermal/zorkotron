const { randRange, directions, direction_diffs } = require("../util.js");

class Cell {
    constructor(map, x, y, direction) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    get neighbors() {
        let neighbors = directions.map(dir => this.getRelative(dir));

        return neighbors;
    }

    getRelative(direction) {
        let [x_diff, y_diff] = direction_diffs[direction];
        return new Cell(this.map, this.x + x_diff, this.y + y_diff, direction);
    }

    is(x, y) {
        return this.x === x && this.y === y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

function carve(cell, limit) {
    let map = cell.map;
    let next = cell.getRelative(cell.direction);
    let free = cell.neighbors.filter(n => !map.get(n.x, n.y));

    map.board.push(cell);

    if (free.length > 0 && (!limit || --limit > 0)) {
        if (Math.random() < 0.75 && !map.get(next.x, next.y)) {
            cell = next;
        } else {
            cell = free.random();
        }

        carve(cell, limit);

        free = free.filter(c => c.direction !== cell.direction);

        if (limit >= 5 && free.length > 0 && Math.random() < 0.1) {
            carve(
                free.random(),
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