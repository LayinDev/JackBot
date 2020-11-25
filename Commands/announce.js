const Command = require("../Structures/Command");
const messages = require(`../Assets/Messages.json`);
const Permissions = require(`../Assets/Permissions.json`);

function announce(channel, announcement) {

    channel.send(announcement);

}

function checkChannel(message, channel) {

    let result = message.guild.channels.cache.get(channel) || message.mentions.channels.first();
    if (!result) {
        message.channel.send(messages.announcements.no_channel);
        return "0";
    } else {
        return result;
    }

}

module.exports = class extends Command {

    constructor(...args) {

        super(...args, {
            name: "announce",
            aliases: ["ac", "shout", "bc", "broadcast"]
        });

    }

    async run(message, args) {

        let perm = message.member.roles.cache.some(role => Permissions.announcements.access_roles.includes(role.id))

        if (!perm) {
            message.channel.send(messages.general.no_perms);
            return;
        }

        if(!args[0]){
            message.channel.send(messages.announcements.missing_channel);
            return;
        }

        const channel = args[0];
        const announcement = args.slice(1).join(" ");

        if(!announcement){
            message.channel.send(messages.announcements.missing_announcements);
            return;
        }

        let announce_channel = checkChannel(message, channel);

        if(announce_channel === "0") return;

        announce(announce_channel, announcement);

    }

}