// Karim Fouad 101244311
// Fall 2022

function showError(message) {
    // Get error div
    let errorDiv = mustGetElementById('errorDiv')
    if (!errorDiv) return

    // Clear previous message
    errorDiv.innerHTML = ''
    errorDiv.style.display = "none"

    // Display new message
    if (message != '') {
        let errorContent = document.createElement('span')
        errorContent.innerHTML = message
        errorDiv.appendChild(errorContent)
        errorDiv.style.display = "block"
    }
}

function requestNewAccount(username, password) {
    let request = new XMLHttpRequest()

    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            let response = JSON.parse(request.responseText)
            console.log(`response (${request.status}):`, response);

            if (request.status == 200) {
                location.href = '/index.html'
            }

            if (request.status >= 500) {
                let errorMessage = "Error: " + response.message + "."
                showError(errorMessage)
            }
        }
    }

    let query = `/newuser?username=${username}&password=${password}`

    request.open('GET', query, true)
    request.send()
}

function createAccount() {
    let userNameField = mustGetElementById('signupUsername')
    let passwordField = mustGetElementById('signupPassword')

    if (!passwordField || !userNameField) {
        return
    }

    let username = userNameField.value.trim()
    let password = passwordField.value

    if (username == "") {
        showError('Username cannot be empty!')
        return
    }

    if (username.includes(' ') || username.includes('\n')) {
        showError('Username cannot contain blank spaces.')
        return
    }

    if (password == "") {
        showError('Password cannot be empty.')
        return
    }

    // Clear current errors before sending new request
    showError('')
    requestNewAccount(username, password)
}


// Click the signup button when the Enter key is pressed
const ENTER = 13
function handleKeyUp(event) {
    event.preventDefault()
    if (event.keyCode === ENTER) {
        let button = mustGetElementById("signupButton")
        if (!button) {
            return
        }
        button.click()
    }
}


// Register event handlers
document.addEventListener('DOMContentLoaded', function () {
    let signupButton = mustGetElementById("signupButton")
    if (signupButton) {
        signupButton.addEventListener('click', createAccount)
        document.addEventListener('keyup', handleKeyUp)
    }
    showError('')
})
