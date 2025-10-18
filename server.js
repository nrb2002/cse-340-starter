/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session") //Import session package
const cookieParser = require("cookie-parser")//Import cookie-parser
const flash = require("connect-flash"); //Import connect-flash 
const pool = require('./database/') //Import connection to the database
const express = require("express") //Import express package
const expressLayouts = require("express-ejs-layouts") //Import ejs
const bodyParser = require("body-parser")
const env = require("dotenv").config() //Import environment variables
const app = express() //Create express application

const static = require("./routes/static") //Import static routes
const inventoryRoute = require("./routes/inventoryRoute") //Import the Inventory route

const accountRoute = require("./routes/accountRoute") //Import account route

const baseController = require("./controllers/baseController") //Import the baseController

const utilities = require("./utilities/") //Import the utilities



/* ***********************
 * Middleware to handle the session
 * ************************/
//Apply the session
 app.use(session({ //invokes the app.use() function and indicates the session is to be applied.
  //Store session data in a table in our PostgreSQL database using connect-pg-simple package
  store: new (require('connect-pg-simple')(session))({ //store is referring to where the session data will be stored.
    createTableIfMissing: true, //tells the session to create a "session" table in the database if it does not already exist.
    pool, //uses our database connection pool to interact with the database server.
  }),
  secret: process.env.SESSION_SECRET, //indicates a "secret" name - value pair that will be used to protect the session. This is stored in the .env file
  resave: true, //This session for the session in the database is typically "false". But, because we are using "flash" messages we need to resave the session table after each message, so it must be set to "true".
  saveUninitialized: true, //this setting is important to the creation process when the session is first created.
  name: 'sessionId', //this is the "name" we are assigning to the unique "id" that will be created for each session.
}))
//This ensures accountData is always available in all restricted views
app.use((req, res, next) => {
  res.locals.accountData = req.session.accountData
  next()
})
//Use the cookie-parser package
app.use(cookieParser())

//Use the JWT middleware to check token
app.use(utilities.checkJWTToken)

//Inject dashboard data in every signed view
app.use(utilities.injectDashboardData)

//Prevent caching of the login page
app.use((req, res, next) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate")
  res.set("Pragma", "no-cache")
  res.set("Expires", "0")
  next()
})


// Express Messages Middleware
app.use(flash()) //Make connect-flash package accessible throughout the application.
app.use(function(req, res, next){
  //This allows any message to be stored into the response, making it available in a view.
  //res.locals.messages = require('express-messages')(req, res)
  res.locals.messages = req.flash()
  next() //passing control to the next piece of middleware in the application.
})

//Express body-parser for post data processing
app.use(bodyParser.json()) //tells the express application to use the body parser to work with JSON data
app.use(bodyParser.urlencoded({ extended: true })) // tells the express application to read and work with data sent via a URL as well as from a form, stored in the request object's body. The "extended: true" object is a configuration that allows rich objects and arrays to be parsed.


 
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")



/* ***********************
 * Routes
 *************************/

/**The resource which has been exported in the static file is now to be used by the app. 
 * This single line of code now allows the app to know where the public folder is located and that it and all of its subfolders will be used for static files.
*/
app.use(static)

//Index route

//This is the base route fetched by a function that takes the request and response objects as parameters.
// app.get("/", (req, res) => {
//   res.render("index", {page: "Home", title:"Home"}) //Express function that will retrieve the specified view - "index" - to be sent back to the browser.
// })

/**
 * Catch any errors generated and send them to the Express Error Handler.
 */
app.get("/", utilities.handleErrors(baseController.buildHome)) //This will execute the function in the controller, build the navigation bar and pass it and the title name-value pair to the index.ejs view, which will then be sent to the client.



//Other static routes
/**
 * app.get('/custom', (req, res) => {
  res.render('custom', { page: 'custom' });
});

// repeat for sedan, suv, truck
 * 
*/

//Inventory routes
app.use("/inv", inventoryRoute) //This means that any route that starts with /inv will then be redirected to the inventoryRoute.js file, to find the rest of the route in order to fulfill the request.

//Account routes
app.use("/account", accountRoute) //All routes starting with /account will be redirected to the accountRoute.js file to find the next part of the route. 






















/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

/* ***********************
* Express 404 Catch-All
* Place this AFTER all routes, BEFORE the error handler
*************************/
app.use((req, res, next) => {
  const err = new Error("File Not Found")
  err.status = 404
  next(err)
})

/* ***********************
* Express Error 500 handler
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav() // Build navigation bar
  let errorImage = await utilities.buildErrorImage(err.status) // call error image dynamically depending on error status code

  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  // Default to 500 if no status is set
  if (!err.status) {
    err.status = 500
  }

  // 404 message for page not found
  let message
  if (err.status === 404) {
    message = "The page you are looking for does not exist."
  } else {
    message = "Query aborted. Please contact your system administrator."
  }

  // Render the error view
  res.status(err.status).render("errors/error", {
    title: `${err.status} | ${err.status === 404 ? "Page not found!" : "Internal server error!"}`,
    message,
    nav,
    errorImage
  })
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
