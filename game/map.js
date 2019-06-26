const { randRange } = require("../util.js");

class Cell {
    constructor(map, x, y) {
        this.map = map;
        this.x = x;
        this.y = y;
    }

    get neighbors() {
        let neighbors = [[-1, 0], [0, 1], [1, 0], [0, -1]].map(([x, y]) => this.getRelative(x, y)).filter(cell => !cell.oob);

        return neighbors;
    }

    get oob() {
        return this.x < 0 || this.y < 0 || this.x >= this.map.width || this.y >= this.map.height;
    }

    getRelative(x_diff, y_diff) {
        return new Cell(this.map, this.x + x_diff, this.y + y_diff);
    }

    is(x, y) {
        return this.x === x && this.y === y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

class Map {
    constructor(width, height) {
        let start_side = ["v", "h"].random();
        let head;

        if(start_side === "v") {
            this.start = head = new Cell(this, randRange(0, width - 1), [0, height - 1].random());
        } else {
            this.start = head = new Cell(this, [0, width - 1].random(), randRange(0, height - 1));
        }

        this.width = width;
        this.height = height;
    }

    visualize() {
        let neighbors = this.start.neighbors;

        console.log(neighbors.join(" "));

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(this.start.is(x, y)) {
                    process.stdout.write("[+]");
                } else if(neighbors.find(c => c.is(x, y))) {
                    process.stdout.write("[*]");
                } else {
                    process.stdout.write("[ ]");
                }
            }

            process.stdout.write("\n");
        }
    }
}

new Map(15, 15).visualize();

module.exports = { Map };