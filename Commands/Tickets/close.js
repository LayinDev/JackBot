const Command = require(`../../Structures/Command`);
const Messages = require(`../../Assets/Messages.json`);
const Permissions = require(`../../Assets/Permissions.json`);


async function closeTicket(message, sql) {

    sql.query(`DELETE FROM active_tickets where t_channel='${message.channel.id}'`, (err) => {
        if (err) {
            message.channel.send(Messages.general.error_msg);
            console.log(err);
            return;
        }
    });

    await message.channel.send(Messages.tickets.close_ticket.replace("%user%", message.member));
    setTimeout(() => {
        message.channel.delete()
    }, 5000)

}


module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "close"
        })
    }

    async run(message, args, sql) {

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
                closeTicket(message, sql)
            }else{
                message.channel.send(Messages.general.no_perms);
                return;
            }

        });

    }
}