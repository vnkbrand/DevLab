const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require('path');

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//  Passport Middleware
app.use(passport.initialize());

//  Passport Config
require("./config/passport")(passport);

//DB Congig
const db = require("./config/keys").mongoURI;

//Connect to MongoDB through Mongoose
mongoose
.connect(db)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

//Use Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

//  This is for deployment to heroku - we will check for production, set the static folder to client build and for any route that gets hit here - we will load react index.html file

//  Server static assets if in production
if(process.env.NODE_ENV == 'production') {
  //  Set a static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(___dirname, 'client', 'build', 'index.html'));
  });
}


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running on port ${port}`));
