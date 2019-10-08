const express   = require("express");
const app       = express();
const dotenv    = require('dotenv');
const mongoose  = require('mongoose');

// Importing Routes
const authRoute = require('./routes/auth');   
const postRoute = require('./routes/posts');

dotenv.config();

// connecting  to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true}, 
    () => console.log("connected to Database"));

//Middlewares
app.use(express.json());

// Router middlewares
app.use('/api/user', authRoute);
app.use('/api/posts',postRoute);

app.listen(3000, () => console.log("server running at port 3000")); 