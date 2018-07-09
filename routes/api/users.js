// Authentication, Login, Passport etc.
// Signup & Authentication of Login
const express = require("express");
const router = express.Router();

//  @route GET to api/users/tests
//  @desc Users post route
//  @access Public
router.get("/test", (req, res) => res.json({msg: "Users Works"}));

module.exports = router;