const Command = require(`../../Structures/Command`);
const Permissions = require(`../../Assets/Permissions.json`);
const messages = require(`../../Assets/Messages.json`);
const ms = require(`ms`);

module.exports = class extends Command {
    constructor(...args){
        super(...args, {
            name: "gstart",
            aliases: ["gcreate"]
        })
    }

    async run(message, args) {

        let perm = message.member.roles.cache.some(role => Permissions.giveaways.access_roles.includes(role.id))

        if (!perm) {
            message.channel.send(messages.general.no_perms);
            return;
        }

        if(!args[0] || !args[1] || !args.slice(2).join(" ")){
            message.channel.send(`Proper Usage: \`${this.client.prefix}gstart {time} {winners} {prize}\``);
            return;   
        }

        let time = args[0];
        let winners = args[1];
        let prize = args.slice(2).join(" ");

        this.client.giveawaysManager.start(message.channel, {
            time: ms(time),
            prize: prize,
            winnerCount: parseInt(winners),
            messages: {
                giveaway: "🎉 **GIVEAWAY** 🎉",
                giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
                inviteToParticipate: "React with 🎉 to participate!",
                timeRemaining: "Time remaining: **{duration}**",
                winMessage: "Congratulations, {winners}! You won **{prize}**!",
                embedFooter: "JackBot Giveaways",
                noWinner: "Giveaway cancelled, no valid participations.",
                winners: "winner(s)",
                endedAt: "End at",
                hostedBy: "Hosted by: {user}",
                units: {
                    "seconds": "seconds",
                    "minutes": "minutes",
                    "hours": "hours",
                    "days": "days",
                    "pluralS": false
                }
            }
        });

    }
}