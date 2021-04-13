const mongoose = require('mongoose');
const Recipe = require ('../models/recipe');

// Mongoose Connection to Mongo
mongoose
	.connect('mongodb://localhost:27017/recipeCapstone', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));

const sampleData = [
    {
        name: 'Tapioca',
		image: 
			'https://images.unsplash.com/photo-1563746098251-d35aef196e83?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80', 
        description: 'Monstera deliciosa, commonly called split-leaf philodendron, is native to Central America.', 
		igredients: 'Most popular in Central America',
		steps: 'First',
		diet: 'Keto Friendly',
		submittedBy: "606f49a0737bdb41670d3507"
	},	
    {
	
        name: 'Power Salad',
		image: 
			'https://images.unsplash.com/photo-1535229398509-70179087ac75?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1534&q=80', 
        description: 'It is a stemless evergreen perennial that, with proper care, will last for many years.', 
		igredients: 'Most popular in South America',
		steps: 'Second',
		diet: 'Vegetarian Friendly',
		submittedBy: "606f49a0737bdb41670d3507"
    },
    {
        name: 'Acai bowl',
		image: 
			'https://images.unsplash.com/photo-1535229398509-70179087ac75?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1534&q=80',
		description: 'Succulent, any recipe with thick fleshy tissues adapted to water storage.',
		igredients:'Most popular in North America',
		steps: 'Third',
		diet:'Vegetarian Friendly',
		submittedBy: "606f49a0737bdb41670d3507"
    }, 
];

// We first clear our database and then add in our restaurant sample
const seedDB = async () => {
	await Recipe.deleteMany({});
	const res = await Recipe.insertMany(sampleData)
		.then((data) => console.log('Data inserted'))
		.catch((e) => console.log(e));
};

// We run our seeder function then close the database after.
seedDB().then(() => {
	mongoose.connection.close();
});