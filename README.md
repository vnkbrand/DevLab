//Login
Once a user is registered - they receive a json webtoken
Once recieved, they can send that to access a protected route - Passport & Passport JWT
Passport validates the tokens


// Create & Update Profile Routes

1. ap/profile.js
- We're going to get everything from req.body
- Fill the profileFields {object} with all of it
- *Including social object
- Search for user by logged-in user's id
- If they have a profile --> Update it with Profile.findOneAndUpdate
- If they don't - ensure there is no handle by that name and if there is - send back an error. If not, we then create the profile.

