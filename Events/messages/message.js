const Event = require(`../../Structures/Event`);
const db = require(`../../Structures/Database`);
const Messages = require(`../../Assets/Messages.json`);

module.exports = class extends Event {
	
    async run(message){
		
		
        const sql = await db.getConnection();
        
		const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

		if (!message.guild || message.author.bot) return;

		sql.query(`SELECT * FROM randomevent where channel_id='${message.channel.id}'`, (err, result, fields) => {

            if(err){
                console.log(err);
                return;
            }

            if(result.length < 1){
                return;
            }

            let guess = message.content;
            let num = result[0].answer.toString();

            if(guess !== num) return;
            if(guess === num){
				message.channel.send(Messages.guess.correct_ans.replace("%user%", message.member).replace("%host%", `<@${result[0].host}>`));
				sql.query(`DELETE FROM randomevent where channel_id='${message.channel.id}'`, (err) => {
					if(err){
					message.channel.send(Messages.general.error_msg);
					return;
					}
				});
            }

        });

		const prefix = this.client.prefix;
		if(!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			command.run(message, args, sql);
		}

    }

}