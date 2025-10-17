// Needed Resources 
const express = require("express") //import express
const router = new express.Router() //create a new router from express package
const accountController = require("../controllers/accountController") //Import Account controller
const utilities = require("../utilities/") //Import utilities index.js file
const regValidate = require('../utilities/account-validation') //Import the account-validation file from utilities


/* ***************************
 *  Route to deliver Account Management View
 * ************************** */

// Route for "My Account" page
router.get(
  "/",
  utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
  utilities.handleErrors(accountController.buildAccountManagement), //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)

/* ***************************
 *  Route to deliver Login view
 * ************************** */

// Route for "Login" page
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)

/* ***************************
 *  Route to login in account
 * ************************** */
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ***************************
 *  Route to logout from account
 * ************************** */
// Process the logout request
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

/* ***************************
 *  Route to deliver Registration view
 * ************************** */

// Route for "Registration" page
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)

/* ***************************
 *  Route to register new account
 * ************************** */
router.post(
  "/register", //The path being watched for in the route.
  regValidate.registrationRules(), //The function containing the rules to be used in the validation process.
  regValidate.checkRegData, //The call to run the validation and handle the errors, if any.
  utilities.handleErrors(accountController.registerAccount) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)






// Export the router
module.exports = router