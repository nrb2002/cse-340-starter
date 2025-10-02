const express = require('express'); //Import express package
const router = express.Router(); //Use express router

// Static Routes
// Set up "public" folder / subfolders for static files

//Express router is to "use" the "express.static" function, meaning this is where static resources will be found, with the public folder.
router.use(express.static("public"));
//Any route that contains /css is to refer to the public/css folder, which is found at the root level of the project.
router.use("/css", express.static(__dirname + "public/css"));
//any route that contains /js is to refer to the public/js folder, which is found at the root level of the project.
router.use("/js", express.static(__dirname + "public/js"));
//any route that contains /images is to refer to the public/images folder, which is found at the root level of the project.
router.use("/images", express.static(__dirname + "public/images"));

//Export module to be used in other areas of the application
module.exports = router;



