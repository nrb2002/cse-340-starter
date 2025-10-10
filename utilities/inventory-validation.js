//Import the utilities file
const utilities = require(".")

//Import the express validator package
const { body, validationResult } = require("express-validator")

const invValidate = {}

//Import the inventory model
const invModel = require("../models/inventory-model")


/*  **********************************************************
  *  Data Validation Rules
/*  **********************************************************
 
//Classification data validation rule
/* 
 This is a function that will return an array of rules to be used when checking the incoming data. 
 Each rule focuses on a specific input from the Classification form.
  */
 invValidate.classificationRules = () => {
  return [
    // Classification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid classification name of more than 3 characters.") // on error this message is sent.

    
    //Check if classification name exists in the database before creating a new user
    .custom(async (classification_name) => {
      const classificationExists = await invModel.checkExistingClassification(classification_name)
      if (classificationExists){
        throw new Error(`Classification "${classification_name}" already exists. Please try with a different name.`)
      }
    })
  ]
}

//Inventory Data Validation Rules

 /*This is a function that will return an array of rules to be used when checking the incoming data. 
 Each rule focuses on a specific input from the Inventory form.
  */
 invValidate.inventoryRules = () => {
  return [
    // Make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a model.") // on error this message is sent.
      //Check if vehicle exists in the database before creating a new user
      .custom(async (inv_model) => {
        const modelExists = await invModel.checkExistingInventory(inv_model)
        if (modelExists){
          throw new Error("Vehicle exists. Please use different model.")
        }
      }),

      // Make is required and must be string
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("Please provide a year."), // on error this message is sent.

    // Make is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a description."), // on error this message is sent.

      // Make is required and must be string
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide an image."), // on error this message is sent.

    // Make is required and must be string
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a thumbnail."), // on error this message is sent.

      // Make is required and must be string
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide a price."), // on error this message is sent.

    // Make is required and must be string
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the mileage."), // on error this message is sent.

      // Make is required and must be string
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide a color."), // on error this message is sent.

    // Make is required and must be string
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a classification."), // on error this message is sent.
  ]
}





/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
/*
if errors are found, then the errors, along with the initial data, 
will be returned to the registration view for correction

*/
//Check Classification data
invValidate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      messages: req.flash("notice") || [],      
      classification_name,
    })
    return
  }
  next()
}

//Check Inventory data
invValidate.checkInvData = async (req, res, next) => {
  const { 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id

  } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "New Inventory",
      nav,
      
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}




module.exports = invValidate