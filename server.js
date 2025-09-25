/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express") //Import express package
const expressLayouts = require("express-ejs-layouts") //Import ejs
const env = require("dotenv").config() //Import environment variables
const app = express() //Create express application

const static = require("./routes/static") //Import static routes
const inventoryRoute = require("./routes/inventoryRoute") //Import the Inventory route

const baseController = require("./controllers/baseController") //Import the baseController

const utilities = require("./utilities/") //Import the utilities


 
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

app.get("/", baseController.buildHome) //This will execute the function in the controller, build the navigation bar and pass it and the title name-value pair to the index.ejs view, which will then be sent to the client.

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
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav() // Build navigation bar
  let errorContent = await utilities.buildErrorContent() // Build error image

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
    errorContent
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
