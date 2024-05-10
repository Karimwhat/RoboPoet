// Karim Fouad 101244311
// Fall 2022

/**
 * Gets HTML element, displays debug error message if not found
 */
function mustGetElementById(id) {
    let element = document.getElementById(id)
    if (element) {
        return element
    } else {
        let errorMessage = ""
        errorMessage += "Something broke! Not a user error! "
        errorMessage += "A required element (id='" + id + "') "
        errorMessage += "is missing from the current HTML page."
        console.error(errorMessage);
        alert(errorMessage);
        return null;
    }
}
