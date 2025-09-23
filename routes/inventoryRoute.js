// Needed Resources 
const express = require("express") //import express
const router = new express.Router() //create a new router from express package
const invController = require("../controllers/invController") //Import Inventory controller

// Route to build inventory by classification view

/**"get" indicates that the route will listen for the GET method within the request (typically a clicked link or the URL itself).
 * 
 * /type/:classificationId the route being watched for (note that the inv element of the route is missing, but it will be accounted for later).
 * 
 * invController.buildByClassification indicates the buildByClassification function within the invController will be used to fulfill the request sent by the route.
 * 
 */

router.get("/type/:classificationId", invController.buildByClassificationId);

//Export the router to be used in other areas of the application
module.exports = router;