const Event = require(`../Structures/Event`);
const db = require(`../Structures/Database`);
const Config = require(`../Assets/Config.json`);
const start = require(`../Assets/startup`);

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    async run() {

        await console.log(`${this.client.user.username} has successfully logged in!`);
        await db.startDatabase();
        let sql = await db.getConnection();
        start.startup(sql);

    }

}