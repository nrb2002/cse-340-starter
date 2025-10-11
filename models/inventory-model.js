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

/* ****************************************
 * Check if a classification already exists
 * **************************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT classification_name FROM classification WHERE classification_name = $1"
    const values = [classification_name]
    const result = await pool.query(sql, values)
    return result.rows.length > 0 // true if exists, false if not
  } catch (error) {
    console.error("Error checking existing classification:", error)
    throw error
  }
}

/* *****************************
*   Insert New Classification into the database
* *************************** */
async function insertClassification(classification_name){
  
  try {
    //declares a "sql" variable and the SQL query to write the data to the database.
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    /*The "RETURNING *" clause indicates to the PostgrSQL server to return values based on the record that was inserted. It is a way to confirm that the insertion worked.*/

    return await pool.query(sql, [classification_name]) //returns the result of the query execution.
  } catch (error) { //Accepts an "error" variable to store any error that is thrown should the "try" block fail.
    console.error() //Print the error details in the console
    
    console.error("Database insertion error:", error); //  affiche le vrai message d'erreur
    throw error; // renvoie l’erreur pour que utilities.handleErrors la capture
  }
}

/* *****************************
 * Check for existing inventory
 * ***************************** */
async function checkExistingInventory(inv_make, inv_model, inv_year) {
  try {
    const sql = `
      SELECT inv_id 
      FROM public.inventory 
      WHERE inv_make = $1 AND inv_model = $2 AND inv_year = $3
    `
    const result = await pool.query(sql, [inv_make, inv_model, inv_year])
    return result.rowCount > 0
  } catch (error) {
    console.error("checkExistingInventory error:", error)
    throw error
  }
}

/* *****************************
*   Insert New Inventory into the database
* *************************** */
async function insertInventory(
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
) {
  try {
    const sql = `
      INSERT INTO inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ])
    return result
  } catch (error) {
    console.error("Database insertion error:", error)
    throw error // Pass the error to the global handler (utilities.handleErrors)
  }
}





//export the functions for use elsewhere
module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  getVehicleById,
  insertClassification,
  insertInventory,
  checkExistingClassification,
  checkExistingInventory,
}