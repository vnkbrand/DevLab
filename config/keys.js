//  Test to see what environment we are in
//  When we DEPLOY TO HEROKU, it will be production
//  When we are in DEV, it will be keys_dev
if(process.env.NODE_ENV === 'production') {
  module.exports = require('./keys_prod');
} else {
  module.exports = require('./keys_dev');
}


