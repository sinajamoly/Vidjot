const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app =express();
// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Map global promise
mongoose.Promise =  global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    // useMongoClient: true
})
    .then(()=>console.log('mongoDB Connected'))
    .catch(err => console.log(err));











//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//method Override middleware
app.use(methodOverride('_method'))


//middleware
app.use(function(req, res, next){
    next();
});

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// connect flash middleware
app.use(flash());

// Global variable
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.errors_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//index Route
app.get('/',(req, res)=>{
    const title = 'Welcome';
    res.render('index', {
        title
    });
});

app.get('/about', (req,res)=>{
    res.render('About')
});





app.use('/ideas',ideas);
app.use('/users',users);

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});

