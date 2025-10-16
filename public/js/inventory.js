'use strict' //tells the JavaScript parser to follow all rules strictly
 
 // Get a list of items in inventory based on the classification_id 
 let classificationList = document.querySelector("#classification_id") //Finds the classification select element in the inventory management view, based on its ID, and stores its reference into a local JavaScript variable.

 //Attaches the eventListener to the variable representing the classification select element and listens for any "change". When a change occurs an anonymous function is executed.
 classificationList.addEventListener("change", function () { 
  let classification_id = classificationList.value //Captures the new value from the classification select element and stores it into a JavaScript variable.
  console.log(`classification_id is: ${classification_id}`) //Writes the value as part of a string to the console log for testing purposes.
  let classIdURL = "/inv/getInventory/"+classification_id //The URL that will be used to request inventory data from the inventory controller. 
  fetch(classIdURL) //The JavaScript "Fetch" which is a modern method of initiating an AJAX request.
  .then(function (response) {  //A "then" method that waits for data to be returned from the fetch. The response object is passed into an anonymous function for processing.

    //test to see if the response was retuned successfull
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  })
  .then(function (data) { //this function requests the data, based on the classification_id and catches any errors if they exist, and sends the retrieved data to the buildInventoryList function for building it into HTML and then displays it into the management view.
   console.log(data); 
   buildInventoryList(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem fetching the inventory: ', error.message) 
  }) 
 })

 // Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
 let inventoryDisplay = document.getElementById("inventoryDisplay"); 
 // Set up the table labels 
 let dataTable = '<thead>'; 
 dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody>'; 
 // Iterate over all vehicles in the array and put each in a row 
 data.forEach(function (element) { 
  console.log(element.inv_id + ", " + element.inv_model); 
  dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
  dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
  dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
 }) 
 dataTable += '</tbody>'; 
 // Display the contents in the Inventory Management view 
 inventoryDisplay.innerHTML = dataTable; 
}