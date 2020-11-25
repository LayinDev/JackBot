const BotClient = require('./Structures/BotClient');
const Config = require('./Assets/Config.json');

const client = new BotClient(Config);
client.start();