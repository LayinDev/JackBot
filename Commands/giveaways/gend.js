const Command = require(`../../Structures/Command`);
const Permissions = require(`../../Assets/Permissions.json`);
const messages = require(`../../Assets/Messages.json`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "gend",
        })
    }

    async run(message, args) {

        let perm = message.member.roles.cache.some(role => Permissions.giveaways.access_roles.includes(role.id))

        if (!perm) {
            message.channel.send(messages.general.no_perms);
            return;
        }

        if (!args[0]) {
            message.channel.send(`Proper Usage: \`${this.client.prefix}gend {message_id}\``);
            return;
        }

        let messageID = args[0];

        let g = this.client.giveawaysManager.giveaways.filter(gi => gi.messageID === messageID);

        if (!g[0]) {
            message.channel.send("No giveaway found for " + messageID + ", please check and try again");
            return;
        }

        this.client.giveawaysManager.edit(messageID, {
            addTime: parseInt(parseInt(g[0].endAt - Date.now()) * -1) + 10
        });

        message.channel.send(`Successfully ended that giveaway!`);

    }




}