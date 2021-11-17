const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

const app = express();

//import routes
// const categoriesRoute = require("./routes/categoriesRoute");
//const FoodsRoute = require("./routes/foodRoute");
//const CartRoute = require("./routes/cartRoute");


//import models.
// const Category = require('./models/categories');
// const Food = require('./models/foods');
//const Route = require('./models/cart);

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;
const categories = require('./models/categories');

// Connect to MongoDB
mongoose
    .connect(
        db, { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//static files.
app.use(express.static(path.join(__dirname, 'public')));

//multer uploads folder
app.use("/uploads", express.static("uploads"));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routess
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/user.js'));
app.use("/category", require('./routes/categoriesRoute.js'));
app.use('/foods', require('./routes/foodRoute.js'));
app.use("/carts", require('./routes/cartRoute.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));


app.get('/', async function(req, res) {
    try {
        const categories = await categories.find({});
        const foods = await foods.find({});

        res.render('UserInterface/dashboard.ejs', { categories: categories, foods: foods });
        //res.status(200).json(abouts);
    } catch (err) {
        console.log(err);
        //res.status(500).json({ error: err });
    }
});

// app.get('/index', function(req, res) {
//     res.render('index.ejs');
// })