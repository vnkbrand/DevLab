// Create users' profiles.
// Location, Bio, Experiences, Education etc.

const express = require("express");
const router = express.Router();

//  @route GET to api/profile/tests
//  @desc Tests profile route
//  @access Public
router.get("/test", (req, res) => res.json({msg: "Profile Works"}));

module.exports = router;