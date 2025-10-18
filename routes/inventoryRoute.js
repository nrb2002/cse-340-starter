// Needed Resources 
const express = require("express") //import express
const router = new express.Router() //create a new router from express package
const invController = require("../controllers/invController") //Import Inventory controller
const utilities = require("../utilities/")

const invValidate = require('../utilities/inventory-validation') //Import the account-validation file from utilities


/* ***************************
 *  Route to build inventory management view
 * ************************** */
router.get(
    "/", 
    utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
    utilities.checkInventoryAuth, //Middleware to check JWT and account type
    utilities.handleErrors(invController.buildManagementView)
)

/* ***************************
 *  Route to the addClassification view
 * ************************** */
router.get(
    "/add-classification", 
    utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
    utilities.checkInventoryAuth,  // <-- Only Employees/Admins
    utilities.handleErrors(invController.buildAddClassificationView)
)

/* ***************************
 *  Route to the addInventory view
 * ************************** */

router.get(
    "/add-inventory", 
    utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
    utilities.checkInventoryAuth,  // <-- Only Employees/Admins
    utilities.handleErrors(invController.buildAddInventoryView)
)

/* ***************************
 *  Route to edit inventory view
 * ************************** */
router.get(
    "/edit/:inv_id", 
    utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
    utilities.checkInventoryAuth,  // <-- Only Employees/Admins
    utilities.handleErrors(invController.buildEditInventoryView)
)

/* ***************************
 *  Route to delete inventory view
 * ************************** */
router.get(
    "/delete/:inv_id", 
    utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
    utilities.checkInventoryAuth,  // <-- Only Employees/Admins
    utilities.handleErrors(invController.buildDeleteInventoryView )
)


/* ***************************
 *  Route to build inventory by classification view
 * ************************** */

/**"get" indicates that the route will listen for the GET method within the request (typically a clicked link or the URL itself).
 * 
 * /type/:classificationId the route being watched for (note that the inv element of the route is missing, but it will be accounted for later).
 * 
 * invController.buildByClassification indicates the buildByClassification function within the invController will be used to fulfill the request sent by the route.
 * 
 */
router.get(
    "/type/:classificationId", 
    utilities.handleErrors(invController.buildByClassificationId)
)

/* ***************************
 *  Route for single vehicle detail view
 * ************************** */
router.get(
    "/detail/:inv_id", 
    utilities.handleErrors(invController.buildByDetailView) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)

/* ***************************
 *  Route to get inventory by classification_id and return the data as JSON 
 * ************************** */
router.get(
    "/getInventory/:classification_id", 
    utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
    utilities.checkInventoryAuth,  // <-- Only Employees/Admins
    utilities.handleErrors(invController.getInventoryJSON)
)

/* ***************************
 *  Route to add new classification
 * ************************** */
router.post(
  "/add-classification", //The path being watched for in the route.
  utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
  utilities.checkInventoryAuth,  // <-- Only Employees/Admins
  invValidate.classificationRules(), //The function containing the rules to be used in the validation process.
  invValidate.checkClassData, //The call to run the validation and handle the errors, if any.
  utilities.handleErrors(invController.addClassification) //Uses utilities.handleErrors() to wrap your controller → this catches errors automatically.
)

/* ***************************
 *  Route to add new inventory
 * ************************** */
router.post(
  "/add-inventory",
  utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
  utilities.checkInventoryAuth,  // <-- Only Employees/Admins
  invValidate.inventoryRules(), // validation rules
  invValidate.checkInvData,    // check validation
  utilities.handleErrors(invController.addInventory)
)

/* ***************************
 *  Route to update inventory
 * ************************** */
router.post(
  "/update-inventory",
  utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
  utilities.checkInventoryAuth,  // <-- Only Employees/Admins
  invValidate.udpateInventoryRules(), // validation rules
  invValidate.checkUpdateData,    // check validation
  utilities.handleErrors(invController.updateInventory)
)

/* ***************************
 *  Route to delete inventory
 * ************************** */
router.post(
  "/delete-inventory",
  utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
  utilities.checkInventoryAuth,  // <-- Only Employees/Admins
  utilities.handleErrors(invController.deleteInventory)
)

/* ***************************
 *  Route to manage classifications
 * ************************** */
//Get all classifications
router.get(
    "/classifications/getAll",
    utilities.checkLogin,
    utilities.checkInventoryAuth, // Only Employee/Admin
    utilities.handleErrors(invController.getAllClassificationsJSON)
)

// Only Employee/Admin
router.get(
  "/classifications/manage",
  utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
  utilities.checkInventoryAuth,  // <-- Only Employees/Admins
  utilities.handleErrors(invController.buildClassificationManagement)
)

router.post(
  "/classifications/update",
  utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
  utilities.checkInventoryAuth,  // <-- Only Employees/Admins
  utilities.handleErrors(invController.updateClassification)
)

router.get(
  "/classifications/delete/:classification_id",
  utilities.checkLogin, //Middleware checking authorization to access designed areas of the site
  utilities.checkInventoryAuth,  // <-- Only Employees/Admins
  utilities.handleErrors(invController.deleteClassification)
)

// Show the update classification form
router.get(
  "/classifications/update/:classification_id",
  utilities.checkLogin,
  utilities.checkInventoryAuth,
  utilities.handleErrors(invController.buildUpdateClassificationView)
)

// Show the update classification form
router.get(
  "/classifications/update/:classification_id",
  utilities.checkLogin,
  utilities.checkInventoryAuth,
  utilities.handleErrors(invController.buildUpdateClassificationView)
)

//Export the router to be used in other areas of the application
module.exports = router;