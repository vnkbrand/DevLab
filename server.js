const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Server static assets if in Production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  <a href="https://app.use" rel="nofollow" target="_blank">app.use</a>(express.static("client/build"));
  <a href="https://app.get" rel="nofollow" target="_blank">app.get</a>("*", (req, res) => {
  <a href="https://res.sendFile" rel="nofollow" target="_blank">res.sendFile</a>(path.resolve(__dirname, "client", "build", "index.html"));
  });
 }

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
