const Event = require(`../../Structures/Event`);
const messages = require(`../../Assets/Messages.json`);
const channels = require(`../../Assets/Channels.json`);
const Permissions = require(`../../Assets/Permissions.json`);
const color = require(`colors`);

module.exports = class extends Event {

    async run(member) {

        if(channels.welcome_channel === null || channels.welcome_channel === ""){
            console.log(`[Missing] welcome_channel @ Channels.json`.red);
            return;
        }

        const welcome_channel = member.guild.channels.cache.get(channels.welcome_channel);
        if (!welcome_channel) {
            console.log(`[Invalid] Cannot find any channels with the provided id.`.red);
            return;
        }

        welcome_channel.send(messages.welcome.message
            .replace("%member%", member.user.username)
            .replace("%server%", member.guild.name)
            .replace("%newline%", `\n`)
            .replace("%count%", member.guild.memberCount));

        if(Permissions.autorole.id === null || Permissions.autorole.id === ""){
            console.log("[Missing] autorole.id @ Permissions.json".red)
            return;
        }

        const autorole = member.guild.roles.cache().get(Permissions.autorole.id);
        if(!autorole){
            console.log(`[Missing] No role found with the provided ID`.red);
            return;
        }

        member.roles.cache.add(autorole.id);



    }

}