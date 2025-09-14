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
app.get("/", function(req, res){
  res.render("index", {title: "Home"}) //Express function that will retrieve the specified view - "index" - to be sent back to the browser.
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
