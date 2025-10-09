const invModel = require("../models/inventory-model") //Import Inventory model
const utilities = require("../utilities/") //Import Utilities

const invCont = {} //Empty object


/* ***************************
 * Build the inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    // Get navigation bar
    let nav = await utilities.getNav()

    // Render the management view
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("notice") || null
    })
  } catch (error) {
    console.error("Error displaying Invetory Management page:", error)
    next(error)
  }
}

/* ***************************
 * Build Add Classification View
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  try {
    // Build the navigation bar
    let nav = await utilities.getNav()

    // Render the add-classification view
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: req.flash("notice") || null
    })
  } catch (error) {
    console.error("Error building Add Classification view:", error)
    next(error)
  }
}

/* ***************************
 * Build Add Inventory View
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    // Build the navigation bar
    let nav = await utilities.getNav()

    // Render the add-inventory view
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      message: req.flash("notice") || null
    })
  } catch (error) {
    console.error("Error building Add Inventory view:", error)
    next(error)
  }
}


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
  res.render("inventory/classification", {
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
  const singleVehicleDetail = await utilities.buildVehicleDetail(vehicleData)

  //Render the view
  const pageTitle = `${vehicleData.inv_make} ${vehicleData.inv_model}`
  res.render("inventory/detail", {
    title: pageTitle,
    nav,
    singleVehicleDetail
  })
}

/* ****************************************
*  Process Add New Classification
* *************************************** */
async function addClassification(req, res) {
  let nav = await utilities.getNav()

  //collects and stores the values from the HTML form that are being sent from the browser in the body of the request object.
  const { classification_name } = req.body 
  try{
    //calls addClassification function, from the model, and uses the "await" keyword to indicate that a result should be returned and wait until it arrives. The result is stored in a local variable.
    const regResult = await invModel.addNewClassification (classification_name)
  
    //if a result was received, sets a flash message to be displayed.
    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash(
        "notice-success",
        `New classification "${classification_name}" created successfully!`
      )
      //calls the render function to return the add-classification view, along with an HTTP 201 status code for a successful insertion of data
      res.status(201).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        messages: req.flash("notice-success") || []
      })
    } else {
      throw new Error("Error inserting data! Please try again or contact your system administrator.")
    }
  } catch (err) {
    console.error("Registration error:", err)
    req.flash("notice-error", "Sorry, the data insertion failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      
      messages: req.flash("notice-error") || [],
      errors: null,
      classification_name
    })
  }
}



//Export the inventory object to be used in other areas of the application
module.exports = invCont