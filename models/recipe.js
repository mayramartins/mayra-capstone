const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const RecipeSchema = new Schema({
    name: String,
    image: String,
    description: String,
    igredients: String,
    steps: String,
    diet: String,
	submittedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}, 
    reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
    
});

RecipeSchema.post('findOneAndDelete', async function (data) {
	if (data) {
		await Review.deleteMany({
			_id: {
				$in: data.reviews,
			},
		});
	}
});

module.exports = mongoose.model('Recipe', RecipeSchema);