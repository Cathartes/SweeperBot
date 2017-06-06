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

		let menu = await msg.reply(toSend);
		
		// Start the reaction collector
		let collector = new ReactionCollector(menu, reactionFilter, {time: TIMEOUT});
		collector.on("collect", (reaction, collector) => {

			if(reaction.emoji.name === "✅" && reaction.users.find("id", msg.author.id)){
				collector.stop();
			}

		});

		collector.once("end", async (reactions) => {
			let rolesToAdd = [];
			let rolesToRemove = [];
			reactions.forEach((reaction) => {
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
						rolesToAdd.push(role);
					}
					else{
						rolesToRemove.push(role);
					}
				}
				
			});

			// Remove roles to assign that are duplicate
			rolesToAdd = rolesToAdd.filter((role) => {
				return !msg.member.roles.find("id", role.id);
			});
			
			// Remove roles to remove that the invoker doesn't actually have
			rolesToRemove = rolesToRemove.filter((role) => {
				return msg.member.roles.find("id", role.id);
			});

			// Get the IDs of roles to remove
			let removedIDs = rolesToRemove.map(r => r.id);

			// Get existing roles, filter out the roles to remove
			let rolesToAssign = msg.member.roles.filter((role) => {
				return !removedIDs.includes(role.id);
			});

			// Add roles we want to add
			rolesToAdd.forEach((role) => {
				rolesToAssign.set(role.id, role);
			});
			
			await msg.member.setRoles(rolesToAssign);
			menu.edit("Roles assigned!");
		});

		await menu.react("1⃣");
		await menu.react("2⃣");
		await menu.react("3⃣");
		await menu.react("✅");
	}
};
