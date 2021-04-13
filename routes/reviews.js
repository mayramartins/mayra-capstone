const express = require('express');
const router = express.Router({ mergeParams:true });
const { reviewSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const asyncCatcher = require('../utilities/asyncCatcher');
const {validateReview, isAuthenticated, isReviewCreator } = require('../middleware/middleware')

const Recipe = require('../models/recipe');
const Review = require('../models/review');


//Create a New Review: EJS SHOW
router.post(
	'/',
	isAuthenticated,
	validateReview, 
	asyncCatcher(async (req, res) => {
		const { id } = req.params;
		const recipe = await Recipe.findById(id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		recipe.reviews.push(review);
		await review.save();
		await recipe.save();
		req.flash('success', 'Review was successfully added!');
		res.redirect(`/recipes/${id}`);
		})
);

//Delete Review Endpoint
router.delete(
	'/:reviewId',
	isAuthenticated,
	isReviewCreator,
	asyncCatcher(async (req, res) => {
		const { id, reviewId } = req.params;
		await Recipe.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'Review was successfully deleted!');
		res.redirect(`/recipes/${id}`);
		
	})
);

module.exports = router;

