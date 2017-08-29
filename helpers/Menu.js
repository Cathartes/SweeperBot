const ReactionCollector = require("discord.js").ReactionCollector;
const TIMEOUT = 180000;

function reactionFilter(reaction){
	return reaction.me;
}

module.exports = class Menu{
	constructor(text, choices, isSingleChoiceMenu){
		this.text = text;
		this.choices = choices;
		this.isSingleChoiceMenu = isSingleChoiceMenu;
	}

	async launch(target){
		return new Promise(async (resolve, reject) => {
			let toSend = this.text;

			if(this.isSingleChoiceMenu){
				toSend.push("Select one:");
			}
			else{
				toSend.push("Select as many as apply:");
			}

			this.choices.forEach((value, key) => {
				toSend.push(`${key} ${value}`);
			});

			if(!this.isSingleChoiceMenu){
				toSend.push("✅ submit when you are done");
			}

			let menu = await target.send(toSend);

			// Start the reaction collector
			let collector = new ReactionCollector(menu, reactionFilter, {time: TIMEOUT});
			collector.on("collect", (reaction, collector) => {

				// If we expect MULTIPLE answers (not a singleChoiceMenu), expect a checkmark to finish the survey
				if(!this.isSingleChoiceMenu && reaction.emoji.name === "✅" && reaction.users.find("id", target.id)){
					collector.stop();
				}
				// else, if it's a singleChoiceMenu, stop
				else if(this.isSingleChoiceMenu && reaction.users.find("id", target.id)){
					collector.stop();
				}

			});

			collector.once("end", async (reactions) => {
				let retVal = [];
				reactions.forEach((reaction) => {
					let key = reaction.emoji.name;
					let value = this.choices.get(key);

					if(value && reaction.users.find("id", target.id)){
						retVal.push(value);
					}
				});

				if(retVal.length == 0){
					reject(target);
				}
				else{
					await menu.delete();
					resolve(retVal, target);
				}
			});


			for(let key of this.choices.keys()){
				await menu.react(key);
			}

			if(!this.isSingleChoiceMenu){
				await menu.react("✅");
			}
		});
	}
};
