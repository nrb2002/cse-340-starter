//Import the utilities file
const utilities = require(".")

//Import the express validator package
/**
 * Express validator contains multiple tools, two of which we have indicated we wish to use: body and validationResult. 
 * 
 * The body tool allows the validator to access the body object, which contains all the data, sent via the HTTPRequest. 
 * 
 * The validationResult is an object that contains all errors detected by the validation process. 
 * 
 * Thus, we use the first tool to access the data and the second to retrieve any errors.
 */
const { body, validationResult } = require("express-validator") 
const validate = {}

//Import the account model
const accountModel = require("../models/account-model")

const jwt = require('jsonwebtoken')//Import JWT package


/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
 /* 
 This is a function that will return an array of rules to be used when checking the incoming data. 
 Each rule focuses on a specific input from the registration form.
  */
 validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    //Check if email exists in the database before granting access to a user
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (!emailExists){
        throw new Error("User does not exist. Please log in with a different email or register. ")
      }
    }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Invalid password; must have at least the following: 12 characters, 1 lowercase, 1 uppercase, 1 number, and 1 special character. "),
  ]
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav, 
      errors,
      messages: req.flash("notice") || [],     
      account_email,
    })
    return
  }
  next()
}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 /* 
 This is a function that will return an array of rules to be used when checking the incoming data. 
 Each rule focuses on a specific input from the registration form.
  */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      //Check if email exists in the database before creating a new user
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("User already registered. Please log in or create new user with a different email.")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
/*
if errors are found, then the errors, along with the initial data, 
will be returned to the registration view for correction

*/
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body //use JavaScript destructuring method to collect and store the firstname, lastname and email address values from the request body.
  
  let errors = [] //creates an empty "errors" array.
  errors = validationResult(req) //calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. All errors, if any, will be stored into the errors array.

  //If there are any errors, call the render function to rebuild the registration view.
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      //These variables below - except the password - will be used to re-populate the form if errors are found.
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next() //if no errors are detected, the "next()" function is called, which allows the process to continue into the controller for the registration to be carried out.
}



validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  ]
}

validate.passwordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

// Validation handlers
validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      messages: req.flash("error") || [],
      accountData: req.body,
    })
  }
  next()
}

validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      messages: req.flash("error") || [],
      accountData: req.body,
    })
  }
  next()
}
/************************************************************************************************** */
/** RESET VALIDATIONS */
/************************************************************************************************** */

/*  **********************************
  *  Reset Data Validation Rules
  * ********************************* */
 /* 
 This is a function that will return an array of rules to be used when checking the incoming data. 
 Each rule focuses on a specific input from the registration form.
  */
 validate.resetRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    //Check if email exists in the database before creating a new user
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
      }
    }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
/*
if errors are found, then the errors, along with the initial data, 
will be returned to the registration view for correction

*/
validate.checkResetData = async (req, res, next) => {
  const {account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/reset", {
      errors,
      title: "Reset Password",
      nav,
      
      account_email,
    })
    return
  }
  next()
}
  





module.exports = validate