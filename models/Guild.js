const mongoose = require("mongoose");

var schema = new mongoose.Schema({
	id: String,
	prefix: String,
	greeting: String,
	elevatedRoles: [String]
});

module.exports = mongoose.model("CATHGuild", schema);
