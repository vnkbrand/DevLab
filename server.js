const express = require("express");
const mongoose = require("mongoose");
const app = express();

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");


app.get('/', (req, res) => res.send("Hello!"));

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


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running on port ${port}`));
