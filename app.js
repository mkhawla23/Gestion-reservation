const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/db.config');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors'); // Add this line to require the cors package

const auth = require('./src/routes/auth.route');
const salleRouter = require('./src/routes/salle.route');
const reservationRouter = require('./src/routes/reservation.route');

const app = express();

app.use(bodyParser.json());

const port = 4000;

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// Configure Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: 'http://localhost:4200' // Add CORS middleware before defining your routes
}));

app.use('/auth', auth);
app.use('/api/salles', salleRouter);
app.use('/api/reservation', reservationRouter);

// Connect to the database
mongoose.connect(dbConfig.url).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.listen(port, () => {
    console.log(`Node server is running on port ${port}`);
});
