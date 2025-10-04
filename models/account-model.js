
//Import database connection
const pool = require("../database/") 


/* **********************
 *   Check for existing email
 * ********************* */
/*
Hopefully, this function looks familiar. 
It queries the database to see if a record exists with the same email that is being submitted. It returns the count of rows found. Anything greater than zero means the email already exists in the database.
*/
// async function checkExistingEmail(account_email){
//   try {
//     const sql = "SELECT * FROM account WHERE account_email = $1"
//     const email = await pool.query(sql, [account_email])
//     return email.rowCount
//   } catch (error) {
//     return error.message
//   }
// }


/* *****************************
*   Register new account
* *************************** */
async function registerAccountModel(
  account_firstname, account_lastname, account_email, account_password){
  
  try {
    //declares a "sql" variable and the SQL query to write the data to the database.
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    /*'Client' is included in the SQL statement to indicate the "type" of account being registered.
    
    The "RETURNING *" clause indicates to the PostgrSQL server to return values based on the record that was inserted. It is a way to confirm that the insertion worked.*/

    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]) //returns the result of the query execution.
  } catch (error) { //Accepts an "error" variable to store any error that is thrown should the "try" block fail.
    return error.message //sends back any error message that is found in the error object.
  }
}

/* *****************************
*   Reset password
* *************************** */
// async function resetAccount(account_email){
//   try {
//     const sql = "SELECT * FROM account WHERE account_email = $1 SET account_password = `{hashedpassword}`"
//     const email = await pool.query(sql, [account_email])
//       return email.rowCount
//   } catch (error) {
//       return error.message    
//   }
// }




module.exports = { 
  registerAccountModel, 
  checkExistingEmail, 
  resetAccount }