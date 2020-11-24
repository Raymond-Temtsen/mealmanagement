require("dotenv").config("./.env");
const express = require("express");
const app = express();
const logger = require("morgan");
const path = require("path");
const expresshandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require('method-override');
const mongoStore = require("connect-mongo")(session);




// Mongodb Config
mongoose.set('useCreateIndex', true);
// Database connections
mongoose.Promise = global.Promise;
const MONGO_URL = require("./config/db").MONGOURL;

mongoose
    .connect(MONGO_URL, {
         useNewUrlParser: true 
    })
    .then(() => console.log(`Database connected at ${MONGO_URL}`))
    .catch(err => console.log(`Database Connection failed ${err.message}`));

const port = process.env.PORT;
// template engine
app.use(logger("dev"));
const hbs = expresshandlebars.create({
    defaultLayout: "default",
    extname: ".hbs"
})
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set('views', __dirname + '/views')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "cafthx",
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        }),
        cookie: {
            maxAge: 120 * 60 * 1000
        }
    })
);

/* Method Override Middleware*/
app.use(methodOverride('newMethod'));
// initalize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Setup flash/ Environmental variables
app.use((req, res, next) => {
    res.locals.success_messages = req.flash("success");
    res.locals.error_messages = req.flash("error");
    res.locals.user = req.user ? true : false;
    res.locals.session = req.session;
    next();
});
app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();
    next();
})
// ================================================ ROUTES BEGIN =========================================
const defaultRoutes = require("./routes/defaultRoutes");
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');

// default route
app.use("/", defaultRoutes);
app.use('/customer',customerRoutes);
app.use('/admin',adminRoutes)

// ================================================ ROUTES END =================================================

app.use((req, res, next) => res.render("default/error404"));
// listen...................................................................................................
app.listen(port, (req, res) => {
    console.log(`Server running at http://localhost:${port}/`);
});