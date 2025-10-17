
//Import database connection
const pool = require("../database/") 


/* **********************
 *   Check for existing email
 * ********************* */
/*
Hopefully, this function looks familiar. 
It queries the database to see if a record exists with the same email that is being submitted. It returns the count of rows found. Anything greater than zero means the email already exists in the database.
*/
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    console.log("Error checking existing email: ", error)
    return 0
  }
}


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  
  try {
    //declares a "sql" variable and the SQL query to write the data to the database.
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    /*'Client' is included in the SQL statement to indicate the "type" of account being registered.
    
    The "RETURNING *" clause indicates to the PostgrSQL server to return values based on the record that was inserted. It is a way to confirm that the insertion worked.*/

    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]) //returns the result of the query execution.
  } catch (error) { //Accepts an "error" variable to store any error that is thrown should the "try" block fail.
    
    console.error("❌ Database insertion error:", error); //Print error message in the console    
    return error.message //sends back any error message that is found in the error object.
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT 
        account_id, 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_type, 
        account_password 
      FROM account 
      WHERE account_email = $1
    `
    const result = await pool.query(sql, [account_email])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error retrieving account by email:", error)
    return null
  }
}


/* *****************************
*   Reset password
* *************************** */
async function resetAccount(account_email, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_email = $2
      RETURNING account_id, account_email
    `
    const result = await pool.query(sql, [hashedPassword, account_email])
    return result.rowCount
  } catch (error) {
    console.error("Error resetting password:", error)
    return 0
  }
}

/* Get account by ID */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
  }
}

/* Update account info */
async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const data = await pool.query(sql, [firstname, lastname, email, account_id])
    return data.rowCount
  } catch (error) {
    console.error("updateAccount error:", error)
  }
}

/* Update password */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2;
    `
    const data = await pool.query(sql, [hashedPassword, account_id])
    return data.rowCount
  } catch (error) {
    console.error("updatePassword error:", error)
  }
}

module.exports = {
  getAccountByEmail,
  registerAccount,
  getAccountById,
  updateAccount,
  updatePassword,
}





module.exports = { 
  registerAccount, 
  checkExistingEmail,
  getAccountByEmail, 
  resetAccount 
  }