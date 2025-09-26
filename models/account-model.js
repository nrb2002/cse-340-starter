
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
    return error.message
  }
}


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Reset password
* *************************** */
async function resetAccount(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 SET account_password = `{hashedpassword}`"
    const email = await pool.query(sql, [account_email])
      return email.rowCount
  } catch (error) {
      return error.message    
  }
}



module.exports = { registerAccount, checkExistingEmail, resetAccount }