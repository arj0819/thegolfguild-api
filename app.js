const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db.config');

const app = express();

//ENABLE ALL CORS REQUESTS
app.use(cors());

//CONVERT BODY TO JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//TEST THE DATABASE
console.log('Attempting to connect to ->', db.config.host);
db.authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch((dbError) => console.log(`Database connection failed: ${dbError}`))


//Golf Course Routes
app.use('/golf-courses', require('./routes/golfCourses'));

//Tee Routes
app.use('/tees', require('./routes/tees'));

//Hole Routes
app.use('/holes', require('./routes/holes'));

//Round Routes
app.use('/rounds', require('./routes/rounds'));

//Round Holes Routes
app.use('/round-holes', require('./routes/roundHoles'));

//Users Routes
app.use('/users', require('./routes/users'));

//Use the current port, or 3000 locally
const PORT = process.env.PORT || 3000;

//Start the app and have it listen for API requests on the chosen port
app.listen(PORT, console.log(`Server listening on port ${PORT}`));
