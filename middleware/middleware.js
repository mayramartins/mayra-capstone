const AppError = require('../utilities/AppError');

const Recipe = require('../models/recipe');
const Review = require('../models/review')

const { recipeSchema, reviewSchema } = require('../joiSchemas');

module.exports.isReviewCreator = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/recipes/${id}`);
	}
	next();
};


module.exports.isAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'You must be signed in to do that');
		return res.redirect('/login');
	}
	next();
};

module.exports.isCreator = async (req, res, next) => {
	const { id } = req.params;
	const recipe = await Recipe.findById(id);
	if (!recipe.submittedBy.equals(req.user._id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/recipes/${id}`);
	}
	next();
};

module.exports.validateRecipe = (req, res, next) => {
	const { error } = recipeSchema.validate(req.body);
	if(error) {
		const msg = error.details.map((e) => e.message).join(',');
		throw new AppError(msg, 400)
	} else {
		next();
	}
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => e.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
};
