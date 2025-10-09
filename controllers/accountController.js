const accountModel = require("../models/account-model")
const utilities = require("../utilities/") //Import Utilities


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
    req.flash("notice-error", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      
      messages: req.flash("notice-error") || [],
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_password: "",
      confirm_password: ""
    })
  }
}




module.exports = { 
  buildLogin,
  buildRegister,
  registerAccount 
}