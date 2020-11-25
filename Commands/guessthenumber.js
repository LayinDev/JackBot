const Command = require(`../Structures/Command`);
const Messages = require(`../Assets/Messages.json`);
const Permissions = require(`../Assets/Permissions.json`);
const { MessageEmbed } = require(`discord.js`);
const Config = require(`../Assets/Config.json`);

async function randomNum(){

    let num = Math.floor(Math.random() * 1000)

    return num;

}

async function createEvent(message, channel, sql){

    let random = await randomNum();

    sql.query(`INSERT INTO randomevent values(${random}, '${channel.id}', '${message.member.id}')`, (err) => {

        if(err){
            console.log(err);
            message.channel.send(Messages.general.error_msg);
            return;
        }

        let embed = new MessageEmbed()
        .setColor(Config.color)
        .setAuthor(`Guess The Number Event!`)
        .setDescription(`**Host:** ${message.member}\n\nGuess the random number between 1 and 1000`);

        channel.send(embed);
        message.channel.send(Messages.guess.created_event.replace("%channel%", channel))

    });

}

module.exports = class extends Command{

    constructor(...args){
        super(...args, {
            name: "guessnum",
            aliases: ["gnum", "gsnum"]
        });
    }

    async run(message, args, sql){
        
        let perm = message.member.roles.cache.some(role => Permissions.guess.access_roles.includes(role.id));
        if(!perm){
            message.channel.send(Messages.general.no_perms);
            return;
        }

        if(!args[0]){
            message.channel.send(Messages.general.no_args);
            return;
        }

        let channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!channel){
            message.channel.send(Messages.announcements.no_channel);
            return;
        }

        sql.query(`SELECT * FROM randomevent where host='${message.member.id}'`, (err, result, fields) => {

            if(err){
                message.channel.send(Messages.general.error_msg);
                console.log(err);
                return;
            }

            if(result.length > 0){
                message.channel.send(Messages.guess.active_event.replace("%user%", message.member).replace("%channel%", `<#${result[0].channel_id}>`));
                return;
            }

            createEvent(message, channel, sql);

        });



    }

}