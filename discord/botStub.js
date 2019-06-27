const keypress = require('keypress');
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

//const game = new Game(messageStub).start();

function getVotes() {
    return new Promise(resolve => {
        process.stdin.setRawMode(true);
        keypress(process.stdin);
        console.log('Please press a key');
        process.stdin.once('keypress', function (ch, key) {
            if (key && key.ctrl & key.name === 'c') { process.exit(0); }
            process.stdin.pause();
            resolve(key);
        });

        process.stdin.resume();
    });
}

function initialize() {
    emitter.emit("new game", { id: 'lol' });
}

module.exports = Object.assign(emitter, { initialize, getVotes });