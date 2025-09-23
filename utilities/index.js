/**
 * This file will hold functions that are "utility" in nature, meaning that we will reuse them over and over, but they don't directly belong to the M-V-C structure.
*/
const invModel = require("../models/inventory-model") //Import inventory-model file
const Util = {} //create an empty Util object

/* ************************
 * Constructs the nav bar
 ************************** */
//creates an asynchronous function, which accepts the request, response and next methods as parameters. The function is then stored in a getNav variable of the Util object.
Util.getNav = async function (req, res, next) {
  //Create the hamburger menu
  let hambMenu =  '<button id="ham-btn" class="hamburger" aria-label="hamburgerMenu">'
  hambMenu += '</button>'  

  let data = await invModel.getClassifications() //calls the getClassifications() function from the inventory-model file and stores the returned resultset into the data variable  

  //Test print the data found to the console
  console.log(data)

  //Build the menu list dynamically
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  //uses a forEach loop to move through the rows of the data array one at a time.
  data.rows.forEach((row) => {
    list += '<li>'
    list += '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + 
    row.classification_name +
    '</a>'
    list += '</li>'
  })
  list += '</ul>'
  
  return hambMenu + list //return both the hamburger menu and the menu items.
}

/* **************************************
* Build the classification view HTML
* ************************************ */

//declare the function as asynchronous, expecting a data array as a parameter.
Util.buildClassificationGrid = async function(data){
  let grid
  //check to see if the array is not empty
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    //set up a "forEach" loop, to break each element of the data array into a vehicle object.
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


module.exports = Util