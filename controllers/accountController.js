const accountModel = require("../models/account-model")
const utilities = require("../utilities/") //Import Utilities
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav() //retrieves and stores the navigation bar string for use in the view.
  
  //calls the render function and indicates the view to be returned to the client and opens the object that will carry data to the view
  res.render("account/login", { //the login view is inside the account folder, which is inside the "views" folder.
    title: "Login",
    nav, //call nav bar
    errors: null,
    messages: req.flash("notice") || [],
  })
}

/* ****************************************
*  Deliver Registration view
* *************************************** */

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav() //retrieves and stores the navigation bar string for use in the view.

  //calls the render function and indicates the view to be returned to the client and opens the object that will carry data to the view
  res.render("account/register", { //the registration view is inside the account folder, which is inside the "views" folder.
    title: "Register",
    nav, //call nav bar
    errors: null,
    messages: req.flash("notice") || [],

    account_firstname: "",
    account_lastname: "",
    account_email: "",
    account_password: "",
    confirm_password: "",
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  //collects and stores the values from the HTML form that are being sent from the browser in the body of the request object.
  const { account_firstname, account_lastname, account_email, account_password } = req.body 
  try{
    //calls registerAccount function, from the model, and uses the "await" keyword to indicate that a result should be returned and wait until it arrives. The result is stored in a local variable.
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    )
  
    //if a result was received, sets a flash message to be displayed.
    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash(
        "notice-success",
        `Congratulations, ${account_firstname}! You\'re now registered. Please log in.`
      )
      //calls the render function to return the login view, along with an HTTP 201 status code for a successful insertion of data
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash("notice-success") || []
      })
    } else {
      throw new Error("Registration failed")
    }
  } catch (err) {
    console.error("Registration error:", err)
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      
      messages: req.flash("notice") || [],
      errors: null,

      account_firstname,
      account_lastname,
      account_email,
      account_password: "",
      confirm_password: ""
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  //If the user's email does not exist in the database, return a message
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      
      messages: req.flash("notice") || [],
      errors: null,

      account_email,
    })
    return
  }

  //If the user exists in the database, process authentication
  try {
    //uses the bcrypt.compare() function which takes the incoming, plain text password and the hashed password from the database and compares them to see if they match.
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password //If the passwords match, then the JavaScript delete function is used to remove the hashed password from the accountData array.
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 }) //the JWT token is created. The accountData is inserted as the payload. The secret is read from the .env file. When the token is ready, it is stored into an "accessToken" variable.

      /**
       * if the development environment is "development" (meaning local for testing), a new cookie is created, named "jwt", the JWT token is stored in the cookie, and the options of "httpOnly: true" and "maxAge: 3600 * 1000" are set. 
       * 
       * This means that the cookie can only be passed through the HTTP protocol and cannot be accessed by client-side JavaScript. It will also expire in 1 hour.
       */
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/") 
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash("notice") || [],
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ***************************
 *  Deliver Account Management view
 * ************************** */
async function buildAccountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      messages: req.flash("notice") || [],
      loggedin: true,
    })
  } catch (err) {
    next(err)
  }
}







module.exports = { 
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
}