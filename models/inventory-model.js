/**
 * Our inventory-model.js document is where we'll write all the functions to interact with the classification and inventory tables of the database, since they are integral to our inventory.
*/

const pool = require("../database/") //Import the database connection file index.js

/* ***************************
 *  Get all classification data
 * ************************** */

//Create an asynchronous function that will return a promise, without blocking the execution of the code
async function getClassifications(){
    //return the result from the SQL query sent to the database server using a pool connection
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

//export the function for use elsewhere
module.exports = {getClassifications}