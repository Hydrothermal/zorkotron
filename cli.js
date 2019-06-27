process.env["cli"] = true;
require("./game/game.js").initialize(true);
require("./discord/botStub.js").initialize();