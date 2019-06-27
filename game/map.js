const { randRange, directions, direction_diffs } = require("../util.js");

class Cell {
    constructor(map, x, y, direction) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    get neighbors() {
        let neighbors = directions.map(dir => this.getRelative(dir)).filter(cell => !cell.oob);

        return neighbors;
    }

    get oob() {
        return this.x < 0 || this.y < 0 || this.x >= this.map.width || this.y >= this.map.height;
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

function carve(cell) {
    let map = cell.map;
    let next = map.head.getRelative(map.head.direction);
    let free = cell.neighbors.filter(n => !map.get(n.x, n.y));

    if(free.length !== 0) {
        if(Math.random() < 0.65 && !next.oob && !map.get(next.x, next.y)) {
            map.head = next;
        } else {
            map.head = free.random();
        }

        map.board.push(map.head);
        carve(map.head);
    }

    map.visualize();
}

class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.head = new Cell(this, Math.floor(width / 2), Math.floor(height / 2));
        this.start = this.head;
        this.board = [this.head];

        this.head.direction = directions.random();
        carve(this.head);
    }

    get(x, y) {
        return this.board.find(cell => cell.is(x, y));
    }

    visualize() {
        let neighbors = this.start.neighbors;
        let output = "";

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(this.start.is(x, y)) {
                    output += ("[+]");
                } else if(this.get(x, y)) {
                    output += ("[#]");
                } else {
                    output += ("[ ]");
                }
            }

            output += ("\n");
        }

        console.log(output);
    }
}

new Map(15, 15).visualize();

module.exports = { Map };