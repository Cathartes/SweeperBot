const Command = require("../types/Command");

const ReactionCollector = require("discord.js").ReactionCollector;

const TIMEOUT = 60000;
function reactionFilter(reaction){
	return reaction.me;
}

module.exports = class Platform extends Command{
	constructor(client){
		super(client, {
			name: "platform",
			help: "DEBUG: Used for testing platform selection and role assignment menu.",
			category: "Destiny",
			guildChannelOnly: true
		});
	}

	async execute(msg, args){	// eslint-disable-line no-unused-vars
		let guild = msg.guild;
		let toSend = [
			", hello! I'm the CATHARTES Clan BOT! It's my job to automate a couple things to make getting started easy.",
			"How will you be playing Destiny 2?",
			"[To pick, select as many reactions as apply]",
			"",
			":one: PC",
			":two: PS4",
			":three: Xbox One",
			":white_check_mark: when you are done."
		];

		// Prepare the menu
		let menu = await msg.reply(toSend);
		await menu.react("1⃣");
		await menu.react("2⃣");
		await menu.react("3⃣");
		await menu.react("✅");

		let collector = new ReactionCollector(menu, reactionFilter, {time: TIMEOUT});
		collector.on("collect", (reaction, collector) => {

			if(reaction.emoji.name === "✅" && reaction.users.find("id", msg.author.id)){
				collector.stop();
			}

		});

		collector.once("end", (reactions) => {
			let rolesToAssign = [];
			let rolesToRemove = [];

			reactions.forEach((reaction) => {
				if(reaction.users.find("id", msg.author.id)){

					let roleName = null;

					switch(reaction.emoji.name){
						case "1⃣":
							roleName = "PC";
							break;
						case "2⃣":
							roleName = "PS4";
							break;
						case "3⃣":
							roleName = "Xbox";
							break;
					}

					if(roleName){
						let role = guild.roles.find("name", roleName);

						if(reaction.users.find("id", msg.author.id)){
							rolesToAssign.push(role);
						}
						else{
							rolesToRemove.push(role);
						}
					}
				}
			});

			msg.member.addRoles(rolesToAssign);
			msg.member.removeRoles(rolesToRemove);
			menu.edit("Roles assigned!");
		});
	}
};
