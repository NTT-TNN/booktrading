var mongoose=require('mongoose');

var bookSchema=mongoose.Schema({
	title: String,
	owner: String,
	thumbnail: String
});

module.exports = mongoose.model('Book',bookSchema);
