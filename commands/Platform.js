const Command = require("../types/Command");

const Menu = require("../helpers/Menu");


module.exports = class Platform extends Command{
	constructor(client){
		super(client, {
			name: "platform",
			help: "DEBUG: Used for testing platform selection and role assignment menu.",
			category: "Destiny",
		});
	}

	async execute(msg, args){	// eslint-disable-line no-unused-vars
		let toSend = [
			"How will you be playing Destiny 2? (The Clan is mainly PC)"
		];

		let choices = new Map();
		choices.set("1⃣", "PC");
		choices.set("2⃣", "PS4");
		choices.set("3⃣", "Xbox");

		let isSingleChoiceMenu = false;

		let platformMenu = new Menu(toSend, choices, isSingleChoiceMenu);
		try{
			let selectedChoices = platformMenu.launch(msg.author);
			this._onMenuResult(selectedChoices, msg.author);
		}
		catch(e){
			msg.author.send(e);
		}
	}

	async _onMenuResult(selectedChoices, target){
		let rolesToAdd = [];
		let rolesToRemove = [];
		let guild = this.client.mainGuild;

		selectedChoices.forEach((value) => {
			let role = guild.roles.find("name", value);
			if(role){
				rolesToAdd.push(role);
			}
		});

		// Any roles not added should be deleted
		if(!rolesToAdd.find(e => e.name == "PC")){
			rolesToRemove.push("PC");
		}
		if(!rolesToAdd.find(e => e.name == "PS4")){
			rolesToRemove.push("PS4");
		}
		if(!rolesToAdd.find(e => e.name == "Xbox")){
			rolesToRemove.push("Xbox");
		}

		let guildMember = guild.members.get(target.id);
		// Remove roles to assign that are duplicate
		rolesToAdd = rolesToAdd.filter((role) => {
			return !guildMember.roles.get(role.id);
		});
		
		// Remove roles to remove that the invoker doesn't actually have
		rolesToRemove = rolesToRemove.filter((role) => {
			return guildMember.roles.get(role.id);
		});

		// Get the IDs of roles to remove
		let removedIDs = rolesToRemove.map(r => r.id);

		// Get existing roles, filter out the roles to remove
		let rolesToAssign = guildMember.roles.filter((role) => {
			return !removedIDs.includes(role.id);
		});

		// Add roles we want to add
		rolesToAdd.forEach((role) => {
			rolesToAssign.set(role.id, role);
		});

		await guildMember.setRoles(rolesToAssign);
		target.send("Roles assigned!");
	}
};
