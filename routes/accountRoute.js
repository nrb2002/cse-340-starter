// Needed Resources 
const express = require("express") //import express
const router = new express.Router() //create a new router from express package
const accountController = require("../controllers/accountController") //Import Account controller
const utilities = require("../utilities/")


/* ***************************
 *  Route to deliver Login view
 * ************************** */

// Route for "My Account" page
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
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
  "/register",
  utilities.handleErrors(accountController.registerAccount) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)

// Export the router
module.exports = router