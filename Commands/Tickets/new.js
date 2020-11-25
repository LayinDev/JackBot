const Command = require(`../../Structures/Command`);
const Messages = require(`../../Assets/Messages.json`);
const Permissions = require(`../../Assets/Permissions.json`);
const Channels = require(`../../Assets/Channels.json`);

function createID(length) {

    let result = '';
    let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charLength = char.length;
    for (let i = 0; i < length; i++) {
        result += char.charAt(Math.floor(Math.random() * charLength));
    }
    return result;

}

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "new",
            aliases: ["support", "tnew"]
        });
    }

    async run(message, args, sql) {

        function createTicket(reason) {

            message.guild.channels.create(`${message.member.user.username}-${message.member.user.discriminator}`, {
                type: 'text'
            }).then(async ch => {

                await ch.edit({
                    parentID: Channels.ticket_category,
                    permissionOverwrites: [{
                            id: message.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        },
                        {
                            id: Permissions.tickets.support_role,
                            allow: ["VIEW_CHANNEL"]
                        }
                    ]
                });


                ch.send(Messages.tickets.opening_message
                    .replace("%user%", message.member)
                    .replace("%server%", message.guild.name)
                    .replace("%reason%", reason)
                )

                sql.query(`INSERT INTO active_tickets values('${createID(7)}', '${message.member.id}', '${ch.id}', '${reason}')`, err => {
                    if (err) {
                        message.channel.send(Messages.general.error_msg);
                        console.log(err)
                        return;
                    }
                });

                message.channel.send(Messages.tickets.new_ticket.replace("%ticket%", ch))

            })

        }

        sql.query(`SELECT * FROM active_tickets where t_owner='${message.member.id}'`, (err, results, fields) => {

            if (err) {
                message.channel.send(Messages.general.error_msg);
                console.log(err);
                return;
            }

            if (results.length > 0) {
                message.channel.send(Messages.tickets.active_ticket.replace("%ticket%", message.guild.channels.cache.get(results[0].t_channel)));
                return;
            }

            let reason = args.join(" ");
            if (!reason) {
                reason = "No reason provided."
            }

            createTicket(reason);

        });




    }

}