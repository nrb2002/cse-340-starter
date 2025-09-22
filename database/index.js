const { Pool } = require("pg") //imports the "Pool" functionality from the "pg" package.
require("dotenv").config() //imports the "dotenv" package which allows the sensitive information about the database location and connection credentials to be stored in a separate location and still be accessed.

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

let pool //create a local pool variable to hold the functionality of the "Pool" connection.

//test to see if the code exists in a developent environment, as declared in the .env file. In the production environment, no value will be found.
if (process.env.NODE_ENV == "development") {
    //creates a new pool instance from the imported Pool class
  pool = new Pool({
    //indicates how the pool will connect to the database (use a connection string) and the value of the string is stored in a name - value pair
    connectionString: process.env.DATABASE_URL,
    //describes how the Secure Socket Layer (ssl) is used in the connection to the database
    ssl: {
      rejectUnauthorized: false,
    },
})

// Added for troubleshooting queries
// during development

//exports an asynchronous query function that accepts the text of the query and any parameters.
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
        //If the query fails, it will console log the SQL text to the console as an error. 
      console.error("error in query", { text })
      throw error
    }
  },
}
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}