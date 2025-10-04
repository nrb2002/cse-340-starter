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
    erros: null,
    messages: req.flash("notice") //call flash message
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
    erros: null,
    messages: req.flash("notice") //call flash message
  })
}




module.exports = { 
  buildLogin,
  buildRegister 
}