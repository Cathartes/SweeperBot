const Menu = require("./Menu");

module.exports = class SurveyLauncher{
	constructor(client){
		this.client = client;
	}

	async launch(target){
		let introMessage = [
			`:exclamation: Hello ${target} :exclamation: Welcome to Cathartes.  We are a Destiny 2 clan that wants to make playing the game more fun.  Here are some quick bullet points on what we are about:`,
			"",
			":desktop: Mostly PC players (Some PS4, next to zero Xbox).",
			":busts_in_silhouette: Great people to talk to and help you finish quests/pvp/raids etc.",
			":calendar_spiral: Events and challenges to celebrate our members.",
			":books: We sharing knowledge by posting secrets/lore/guides/theories/etc.",
			":do_not_litter: We are respectful and adhere to a strict set of rules of conduct.",
			":globe_with_meridians: Visit our website to learn more: https://cathartes.blog/",
			"",
			"In order to gain full access to the Clan Discord you need to complete the following quick survey:"
		];

		await target.send(introMessage);

		let memberPath = await _getMemberPath(target);

		if(memberPath){
			await _surveyPlatforms(target);
			await _surveyClasses(target);
		}
	}

	async _getMemberPath(target){
		let toSend = [
			"Are you applying to join CATHARTES as a full member?",
			"Or if you already have a clan, or don’t play Destiny 2 would you like to be a (non-member) Friend of the Clan?"
		];

		let choices = new Map();
		choices.set("1⃣", "I'd like to be a member.");
		choices.set("2⃣", "I'm just here to hang out.");

		let isSingleChoiceMenu = true;

		let pathMenu = new Menu(toSend, choices, isSingleChoiceMenu);
		let path = await pathMenu.launch(target);
		path = path[0];

		return path == "I'd like to be a member." ? true : false;
	}

	async _surveyPlatforms(target){
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
			let selectedChoices = await platformMenu.launch(target);
			let possibleValues = [
				"PC",
				"PS4",
				"Xbox"
			];

			this._onGuildRoleSurveyResult(selectedChoices, target, possibleValues);
		}
		catch(e){
			target.send(e);
		}
	}

	async _surveyClasses(target){
		let toSend = [
			"What classes will you be playing Destiny 2?"
		];

		let choices = new Map();
		choices.set("1⃣", "Hunter");
		choices.set("2⃣", "Titan");
		choices.set("3⃣", "Warlock");

		let isSingleChoiceMenu = false;

		let classMenu = new Menu(toSend, choices, isSingleChoiceMenu);
		try{
			let selectedChoices = await classMenu.launch(target);
			let possibleValues = [
				"Hunter",
				"Titan",
				"Warlock"
			];

			this._onGuildRoleSurveyResult(selectedChoices, target, possibleValues);
		}
		catch(e){
			target.send(e);
		}

	}

	async _onGuildRoleSurveyResult(selectedChoices, target, possibleValues){
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
		possibleValues.forEach(roleName => {
			if(!rolesToAdd.find(e => e.name == roleName)){
				rolesToRemove.push(guild.roles.find("name", roleName));
			}
		})

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
