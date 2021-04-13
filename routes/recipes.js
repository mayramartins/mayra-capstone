const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utilities/asyncCatcher');
const { recipeSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const { 
	isAuthenticated, 
	isCreator, 
	validateRecipe,
 } = require('../middleware/middleware');

const Recipe = require('../models/recipe');


// Rendering our Index Route
router.get(
	'/', 
	asyncCatcher( async (req, res) => {
    const recipes = await Recipe.find({});
    res.render('recipes/index', { recipes });
}));

// Render New Form
router.get('/new', isAuthenticated, (req, res) => {
	res.render('recipes/new');

});

// Create a New Recipe | EJS: SHOW
router.post (
	'/',
	isAuthenticated,
	validateRecipe, 
	asyncCatcher(async (req, res) => {
		const recipe = new Recipe(req.body.recipe);
		recipe.submittedBy = req.user._id;
		await recipe.save();
    	req.flash('success', 'New Recipe was successfully added!');
		res.redirect(`/recipes/${recipe.id}`);
	})
);

// Render the edit Form
router.get(
	'/:id/edit', 
	isAuthenticated,
	isCreator,
	asyncCatcher(async (req, res) => {
	    const { id } = req.params;
	    const recipe = await Recipe.findById(id);
        if(!recipe) {
            req.flash('error', 'Recipe does not exist!');
            res.redirect('/recipes');
        }
	    res.render('recipes/edit', { recipe });
}));

// Render Show Page
router.get(
	'/:id', 
	asyncCatcher( async (req, res, next) => {
    const { id }  = req.params
    const recipe = await Recipe.findById(id)
		.populate({
				path: "reviews",
				populate: {
					path:"author"
				}
			})
		.populate('submittedBy');
	if (!recipe) {
        req.flash('error', 'Recipe does not exist!');
        res.redirect('/recipes')
		// return next(new AppError('Recipe not found!', 404));
	}
    res.render('recipes/show', { recipe });
	
 
}));

// Update a Recipe
router.put(
	'/:id',
	isAuthenticated,
	isCreator,
    validateRecipe, 
	asyncCatcher( async (req, res) => {
	    const { id } = req.params;
	    const recipe = await Recipe.findByIdAndUpdate(id, {
            ...req.body.recipe,
        });
        req.flash('success', 'Recipe was successfully updated!');
	    res.redirect(`/recipes/${recipe.id}`)
}));

// Delete a Recipe
router.delete(
	'/:id/delete',
	isAuthenticated,
	isCreator, 
	asyncCatcher( async (req, res) => {
	    const { id } = req.params;
	    await Recipe.findByIdAndDelete(id);
        req.flash('success', 'Recipe was successfully deleted!');
	    res.redirect('/recipes');
    })
);

module.exports = router;


