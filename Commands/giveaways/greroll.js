const Command = require(`../../Structures/Command`);
const Permissions = require(`../../Assets/Permissions.json`);
const messages = require(`../../Assets/Messages.json`);

module.exports = class extends Command {
    constructor(...args){
        super(...args, {
            name: "greroll",
        })
    }

    async run(message, args){

        let perm = message.member.roles.cache.some(role => Permissions.giveaways.access_roles.includes(role.id))

        if (!perm) {
            message.channel.send(messages.general.no_perms);
            return;
        }

        if(!args[0]){
            message.channel.send(`Proper Usage: \`${this.client.prefix}greroll {message_id}\``);
            return;   
        }

        let messageID = args[0];
        this.client.giveawaysManager.reroll(messageID).then(() => {
            message.channel.send("Success! Giveaway rerolled!");
        }).catch((err) => {
            message.channel.send("No giveaway found for "+messageID+", please check and try again");
        });

    }
}