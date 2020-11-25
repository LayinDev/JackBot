const Command = require(`../../Structures/Command`);
const Messages = require(`../../Assets/Messages.json`);
const Permissions = require(`../../Assets/Permissions.json`);

async function remUser(message, user){

    message.channel.updateOverwrite(user, {
        VIEW_CHANNEL: false
    });
    message.channel.send(Messages.tickets.remove_user.replace("%user%", user));

}

module.exports = class extends Command{

    constructor(...args){
        super(...args, {
            name: "remove"
        });
    }

    async run(message, args, sql){

        if(!args[0]){
            message.channel.send(Messages.general.no_args);
            return;
        }
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if(!user){
            message.channel.send(Messages.general.no_user);
            return;
        }

        sql.query(`SELECT * FROM active_tickets where t_channel='${message.channel.id}'`, (err, results, fields) => {
            if (err) {
                message.channel.send(Messages.general.error_msg);
                console.log(err);
                return;
            }

            if (results.length < 1) {
                message.channel.send(Messages.tickets.non_ticket);
                return;
            }

            if (results[0].t_owner === message.member.id || message.member.roles.cache.has(Permissions.tickets.support_role)) {
                remUser(message, user)
            }else{
                message.channel.send(Messages.general.no_perms);
                return;
            }

        });

    }

}