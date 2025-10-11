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

/* ***************************
 * Build single vehicle detail HTML
 * ************************** */
Util.buildVehicleDetail = async function (vehicle) {
  let html = `
  <section id="vehicle-detail">
    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
    </div>
    <div class="vehicle-info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model} ($${new Intl.  NumberFormat('en-US').format(vehicle.inv_price)})</h2>

      <ul>
        <li><strong>Price:</strong> $${new Intl.  NumberFormat('en-US').format(vehicle.inv_price)}</li>
        <li><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</li>
        <li><strong>Color:</strong> ${vehicle.inv_color}</li>
        <li><strong>Description:</strong> ${vehicle.inv_description}</li>
      </ul>
    </div>
  </section>
  `
  return html
}

/* ***************************
 * Build Classification list for combo list
 * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  
  // The key fix here: name="classification_id" and id="classification_id"
  let classificationList = '<select name="classification_id" id="classification_id" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}" ${
      classification_id && row.classification_id == classification_id ? "selected" : ""
    }>${row.classification_name}</option>`
  })

  classificationList += "</select>"
  
  return classificationList
}



  














/* **************************************
* Build the error background
* ************************************ */
//Build error image depending on error code
Util.buildErrorImage = async function (status){
  let errorImage = ''

  if (status === 404) {
    errorImage = '<div class="errorImage"><img src="/images/site/cse-404-1.jpg"></div>'
  }else {
    errorImage = '<div class="errorImage"><img src="/images/site/cse-500.jpg"></div>'
  }

  return errorImage
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */

//Create a function which accepts a request, a response, and next as parameters along with another arrow function
/**
 * The wrapped function is called and attempts to fulfill its normal process, but now does so within a JavaScript promise. 
 * If it succeeds, then the promise is resolved and everything continues normally.
 * 
 * If there is an error, the promise fails.  
 */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

//Because it is an "error" that is being passed via the "next" function, the Express Error Handler will catch the error and then build and deliver the error view to the client.


module.exports = Util