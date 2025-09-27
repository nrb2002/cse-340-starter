/**
 * Our inventory-model.js document is where we'll write all the functions to interact with the classification and inventory tables of the database, since they are integral to our inventory.
*/

const pool = require("../database/") //Import the database connection

/* ***************************
 *  Get all classification data
 * ************************** */

//Create an asynchronous function that will return all rows from the classification table
async function getClassifications(){
    //return the result from the SQL query sent to the database server using a pool connection
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */

//declare an asynchronous function by name and passes a variable, which should contain the classification_id value, as a parameter.
async function getInventoryByClassificationId(classification_id) {
  try {
    //Select items by classification 
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle by ID
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0] //send the data as an array of all the rows, back to where the function was called (in the controller)
  } catch (error) {
    console.error("getVehicleById error: ", error)
  }
}





//export the functions for use elsewhere
module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  getVehicleById
}