/**
 * This file will hold functions that are "utility" in nature, meaning that we will reuse them over and over, but they don't directly belong to the M-V-C structure.
*/
const invModel = require("../models/inventory-model") //Import inventory-model file
const Util = {} //create an empty Util object

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
//creates an asynchronous function, which accepts the request, response and next methods as parameters. The function is then stored in a getNav variable of the Util object.
Util.getNav = async function (req, res, next) {
  //Create the hamburger menu
  let hambMenu =  '<button id="ham-btn" class="hamburger" aria-label="hamburgerMenu">'
  hambMenu += '</button>'  

  let data = await invModel.getClassifications() //calls the getClassifications() function from the inventory-model file and stores the returned resultset into the data variable  

  //Build the menu list dynamically
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  //uses a forEach loop to move through the rows of the data array one at a time.
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  
  return hambMenu + list //return both the hamburger menu and the menu items.
}

module.exports = Util