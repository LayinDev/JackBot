const {
	Client,
	Collection
} = require('discord.js');
const Util = require('./Util.js');
const {
	GiveawaysManager
} = require(`discord-giveaways`);
const Config = require(`../Assets/Config.json`);

module.exports = class BotClient extends Client {

	constructor(options = {}) {
		super({
			
		});
		this.validate(options);

		this.commands = new Collection();

		this.aliases = new Collection();

		this.events = new Collection();

		this.utils = new Util(this);

		this.owners = options.owners;
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.token) throw new Error('You must pass the token for the client.');
		this.token = options.token;

		if (!Config.prefix) throw new Error('You must pass a prefix for the client.');
		if (typeof Config.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = Config.prefix;
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		const client = this;
		const manager = new GiveawaysManager(client, {
			storage: `./Assets/Giveaways.json`,
			updateCountdownEvery: 3500,
			default: {
				botsCanWin: false,
				embedColor: Config.color,
				reaction: "🎉"
			}
		})
		client.giveawaysManager = manager;
		super.login(token);
	}

};