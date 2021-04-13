if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Recipe = require('./models/recipe');
const Review = require('./models/review');

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./utilities/AppError');
const asyncCatcher = require('./utilities/asyncCatcher');
const { recipeSchema, reviewSchema } = require('./joiSchemas');

// Import Routes
const recipeRoutes = require('./routes/recipes');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/users');

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const PassportLocal = require('passport-local');
const User = require('./models/user');

const MongoStore = require('connect-mongo');

// 'mongodb://localhost:27017/recipeCapstone'

// process.env.DB_STRING,

const url = process.env.DB_STRING || 'mongodb://localhost:27017/restaurantCapstone'

// Mongoose Connection to Mongo			
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));

// Setting up EJS and its pathing
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Parsing the form body
app.use(express.urlencoded({extended: true}));

// Method Override
app.use(methodOverride('_method'));

// Making public folder available
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));

const secret = process.env.SECRET || 'drake';

const store = MongoStore.create({
	mongoUrl: url,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret,
	},
});

// This checks for any errors that may occur.
store.on('error', (e) => {
	console.log('Store Error', e);
});

const sessionConfig = {
	store, 
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};

app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ------------ Middleware--------------

app.use((req, res, next) => {
	res.locals.user = req.user
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	console.log(res.locals.success);
	next();
});

//-----------------------------------------------

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((e) => e.message).join(',');
		throw new AppError(msg, 400);
	} else {
		next();
	}
};

// ---------- Routes ------------------------
app.get('/', (req, res) => {
    res.render('home');
});

// ----------- RECIPE ROUTES --------------
app.use('/recipes', recipeRoutes);

//------------ REVIEW ROUTES ------------------
app.use('/recipes/:id/reviews', reviewRoutes);

// ----------- AUTH ROUTES --------------
app.use('/', authRoutes);



app.use((req, res) => {
	next(new AppError('Page not found', 404));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	const { message = 'I am in danger' } = err;
	res.status(status).render('error', { err });
});

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Listening on port 3000")
});



