'use strict'

// Build classification table
function buildClassificationTable(data) {
    let classificationDisplay = document.getElementById("classificationDisplay")
    if (!classificationDisplay) return

    let tableHTML = '<thead>'
    tableHTML += '<tr><th>Classification Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'
    tableHTML += '</thead>'

    tableHTML += '<tbody>'
    data.forEach(item => {
        tableHTML += `<tr>
            <td>${item.classification_name}</td>
            <td><a href='/inv/classifications/update/${item.classification_id}' title='Click to update'>Modify</a></td>
            <td><a href='/inv/classifications/delete/${item.classification_id}' title='Click to delete'>Delete</a></td>
        </tr>`
    })
    tableHTML += '</tbody>'

    classificationDisplay.innerHTML = tableHTML
}

// Fetch all classifications when page loads
document.addEventListener("DOMContentLoaded", () => {
    fetch("/inv/classifications/getAll")
        .then(response => {
            if (response.ok) return response.json()
            throw Error("Network response was not OK")
        })
        .then(data => buildClassificationTable(data))
        .catch(error => console.error("Error fetching classifications:", error.message))
})
