const Command = require("../types/Command");
module.exports = class About extends Command{
	constructor(client){
		super(client, {
			name: "about",
			help: "Let me tell you all about me, and how to get support or invite me to your server.",
			category: "Misc",
			elevation: 0
		});
	}

	async execute(msg, args){	// eslint-disable-line no-unused-vars
		return msg.reply(`Hi! I'm CATHbot version ${this.client.package.version}.\n\nYou can follow my development here: https://github.com/Buluphont/CATHbot`);
	}
};
