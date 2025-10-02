// Needed Resources 
const express = require("express") //import express
const router = new express.Router() //create a new router from express package
const accountController = require("../controllers/accountController") //Import Account controller
const utilities = require("../utilities/")


/* ***************************
 *  Route to build Login view
 * ************************** */

// Route for "My Account" page
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)

// Export the router
module.exports = router