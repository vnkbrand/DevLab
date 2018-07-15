// Create users' profiles.
// Location, Bio, Experiences, Education etc.

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//  Load Validation
const validateProfileInput = require("../../validation/profile");

const validateExperienceInput = require("../../validation/experience");

const validateEducationInput = require("../../validation/education");



//  Load Profile Model
const Profile = require("../../models/Profile");
//  Load User Model
const User = require("../../models/User");


//  @route GET to api/profile/tests
//  @desc Tests profile route
//  @access Public
router.get("/test", (req, res) => res.json({
  msg: "Profile Works"
}));

//  @route GET api/profile
//  @desc Get Current User's Profile
//  @access Private
router.get("/", passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const errors = {};

    Profile.findOne({
        user: req.user.id
      })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  });

//  @route GET to api/profile/all
//  @desc Get all profiles
//  @access Public **anyone can see profiles
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({
        profile: "There are no profiles."
      })
    );
});

//  @route GET to api/profile/handle/:handle **backend route - Url won't need 'handle'in the URL
//  @desc Get profile by handle
//  @access Public **anyone can see profiles
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({
      handle: req.params.handle
    })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//  @route GET api/profile/user/:user_id
//  @desc Get profile by user ID
//  @access Public **anyone can see profiles
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({
      user: req.params.user_id
    })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({
        profile: "There is no profile for this user."
      })
    );
});

//  @route POST to api/profile
//  @desc Create or Edit User Profile
//  @access Private
router.post("/", passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const {
      errors,
      isValid
    } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    // id = avatar, name & email
    profileFields.user = req.user.id;
    //  Check if handle was sent from form and then set to profileFields.handle
    if (req.body.handle) profileFields.handle = req.body.handle;

    if (req.body.company) profileFields.company = req.body.company;

    if (req.body.website) profileFields.website = req.body.website;

    if (req.body.location) profileFields.location = req.body.location;

    if (req.body.bio) profileFields.bio = req.body.bio;

    if (req.body.status) profileFields.status = req.body.status;

    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //  Skills - Split into an array - split into comma
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // Social in own object (ofFields) - if it comes in, then set to the value of youtube
    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;

    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;

    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({
        user: req.user.id
      })
      .then(profile => {
        if (profile) {
          //If profile exists - then update
          Profile.findOneAndUpdate({
              user: req.user.id
            }, {
              $set: profileFields
            }, {
              new: true
            })
            .then(profile => res.json(profile));
        } else {
          // Create a new profile

          // Check if handle exists
          Profile.findOne({
              handle: profileFields.handle
            })
            .then(profile => {
              if (profile) {
                errors.handle = "That handle already exists";
                res.status(400).json(errors);
              }
              //  Save Profile
              new Profile(profileFields)
                .save()
                .then(profile => res.json(profile));
            });
        }
      });
  });

//  @route POST to api/profile/experience
//  @desc Add an Experience to Profile
//  @access Private
router.post("/experience", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateExperienceInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      // Add to experience array (not push as add to the beg of array)
      profile.experience.unshift(newExp);

      profile.save()
        .then(profile => res.json(profile));
    })
});

//  @route POST to api/profile/education
//  @desc Add an Education to Profile
//  @access Private
router.post("/education", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateEducationInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      // Add to experience array (not push as add to the beg of array)
      profile.education.unshift(newEdu);

      profile.save()
        .then(profile => res.json(profile));
    })
});

//  @route DELETE to api/profile/experience/:exp_id
//  @desc Delete experience from profile
//  @access Private
router.delete("/experience/:exp_id", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      //Get Remove Index
      const removeIndex = profile.experience
        .map(item => item.id)
        //Get id of correct exp to delete
        .indexOf(req.params.exp_id);
      //Splice out of array
      profile.experience.splice(removeIndex, 1);
      //Save
      profile.save()
        .then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

//  @route DELETE to api/profile/education/:edu_id
//  @desc Delete education from profile
//  @access Private
router.delete("/education/:edu_id", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      //Get Remove Index
      const removeIndex = profile.education
        .map(item => item.id)
        //Get id of correct exp to delete
        .indexOf(req.params.edu_id);
      //Splice out of array
      profile.education.splice(removeIndex, 1);
      //Save
      profile.save()
        .then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

//  @route DELETE to api/profile
//  @desc Delete User & Profile
//  @access Private
router.delete("/", passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOneAndRemove({
        user: req.user.id
      })
      .then(() => {
        User.findOneAndRemove({
            _id: req.user.id
          })
          .then(() => res.json({
            success: true
          }));
      });
  });
module.exports = router;