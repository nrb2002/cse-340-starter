const invModel = require("../models/inventory-model") //Import Inventory model
const utilities = require("../utilities/") //Import Utilities

const invCont = {} //Empty object

/* ***************************
 *  Build inventory by classification view
 * ************************** */

//create an asynchronous, anonymous function which accepts the request and response objects, along with the Express next function as parameters. The function is stored into a named method of buildByClassificationId.
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId //collect the classification_id that has been sent, as a named parameter, through the URL
  const data = await invModel.getInventoryByClassificationId(classification_id) //Get inventory data from the model
  const grid = await utilities.buildClassificationGrid(data) //call grid function from the utilities, containing all vehicles within that classification
  let nav = await utilities.getNav() //call the function to build the navigation bar
  const className = data[0].classification_name //extract the name of the classification, which matches the classification_id, from the data returned from the database

  //return a view to the browser named classification (see inventory directory in the views folder), containing the title, nav bar, and a grid to display matching cars. 
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build single vehicle detail view
 * ************************** */
invCont.buildByDetailView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)

  //Get the vehicle data
  const vehicleData = await invModel.getVehicleById(inv_id)

  //If no vehicle found, throw 404
  if (!vehicleData) {
    return next({ status: 404, message: "Vehicle not found" })
  }

  //Build the nav and detail HTML
  const nav = await utilities.getNav()
  const vehicleHTML = await utilities.buildVehicleDetail(vehicleData)

  //Render the view
  const pageTitle = `${vehicleData.inv_make} ${vehicleData.inv_model}`
  res.render("inventory/detail", {
    title: pageTitle,
    nav,
    vehicleHTML
  })
}


//Export the inventory object to be used in other areas of the application
module.exports = invCont