const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportHttp = require('passport-http');
const app = express();

//configure app
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'assets/')));
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal.Strategy(verifyCredentials));
passport.use(new passportHttp.BasicStrategy(verifyCredentials));

function verifyCredentials(username, password, done){
    //pretend database
    if(username === password){
        done(null, { id: username, name: username });
    } else {
        done(null, null);
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    //query database or cache here
    done(null, { id: id, name: id });
});

app.use(require('./home'));
app.use(require('./login'));
app.use(require('./api'));

//port
var port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})