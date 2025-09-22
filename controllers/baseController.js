/**
 * A controller is the location where the logic of the application resides. It is responsible for determining what action is to be carried out in order to fulfill requests submitted from remote clients. The "base" controller will be responsible only for requests to the application in general, and not to specific areas (such as inventory or accounts).
*/

const utilities = require("../utilities/") //Import the utilities module
const baseController = {} //create an empty object for the controller

//Create an anonymous asynchronous function which will build the home page
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav() //calls a getNav() function that will be found in the utilities > index.js file
  res.render("index", {title: "Home", nav}) //use EJS to send the index view back to the client, using the response object. The index view will need the "title" name - value pair, and the nav variable. The nav variable will contain the string of HTML code to render this dynamically generated navigation bar.
}

//Export module for use elsewhere in the application
module.exports = baseController