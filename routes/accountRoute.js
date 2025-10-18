// Needed Resources 
const express = require("express") //import express
const router = new express.Router() //create a new router from express package
const accountController = require("../controllers/accountController") //Import Account controller
const utilities = require("../utilities/") //Import utilities index.js file
const accountValidate = require('../utilities/account-validation') //Import the account-validation file from utilities


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

router.get(
  "/login",
  (req, res, next) => {
    // If user already has a valid JWT cookie → log them out first
    const token = req.cookies.jwt
    if (token) {
      res.clearCookie("jwt")
      req.flash("notice", "You have been signed out: PLease, log in again.")
    }
    next()
  },
  utilities.handleErrors(accountController.buildLogin)
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
 *  Route to deliver update view
 * ************************** */
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

/* ***************************
 *  Route to login in account
 * ************************** */
// Process the login request
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)



/* ***************************
 *  Route to register new account
 * ************************** */
router.post(
  "/register", //The path being watched for in the route.
  accountValidate.registrationRules(), //The function containing the rules to be used in the validation process.
  accountValidate.checkRegData, //The call to run the validation and handle the errors, if any.
  utilities.handleErrors(accountController.registerAccount) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)

// Process account info update
router.post(
  "/update-account",
  utilities.checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  utilities.checkLogin,
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)






// Export the router
module.exports = router