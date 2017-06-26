var mongoose = require("mongoose");

var Schema = mongoose.Schema;

CommentSchema = new Schema({

	body:{
		type: String,
		required:true
	},
	display:{
		type: Boolean,
		default: true
	}
});


CommentSchema.method.hide = function(){
	this.display = false;
};


var Comment = mongoose.model("Comment", CommentSchema);



module.exports = Comment;