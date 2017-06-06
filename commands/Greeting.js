const Command = require("../types/Command");
const Guild = require("../models/Guild");
module.exports = class Greeting extends Command{
	constructor(client){
		super(client, {
			name: "greeting",
			help: "Sets a message for me to send to anybody who joins this server.",
			category: "Admin",
			helpArgs: "<prefix>",
			elevation: 1,
			guildChannelOnly: true
		});
	}

	async execute(msg, args){	// eslint-disable-line no-unused-vars
		let guild = await Guild.findOne({id: msg.guild.id});
		guild.greeting = args.join(" ");
		await guild.save();
		return msg.reply("successfully set this guild's greeting.");
	}
};
