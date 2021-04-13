const Joi = require('joi');

module.exports.recipeSchema = Joi.object({
    recipe: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    igredients: Joi.string().required(),
    steps: Joi.string().required(),
    diet: Joi.string().required(),
    }),

});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().required().min(1).max(5),
	}).required(),
});