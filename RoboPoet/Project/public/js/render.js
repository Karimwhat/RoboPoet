// Karim Fouad 101244311
// Fall 2022

/**
 * Display poem in HTML, given poem string
 */
function renderPoem(poemString) {
    poem = poemString.trim().split("\n\n")

    // Get poem div
    let poemDiv = mustGetElementById('poemDiv')
    if (!poemDiv) return

    // Display poem
    poemDiv.innerHTML = ''
    for (segment of poem) {
        let segmentDiv = document.createElement("div")
        segmentDiv.className = "poemSegment"

        for (line of segment.trim().split("\n")) {
            console.log("line:", line)
            let lineDiv = document.createElement("div")
            lineDiv.className = "poemLine"
            lineDiv.innerHTML = line
            segmentDiv.appendChild(lineDiv)
        }

        poemDiv.appendChild(segmentDiv)
    }

    // Restore user UI
    enableUserInput()
}

/**
 * Display currently chosen max word count
 */
function renderMaxWordCount() {
    // Get max word count slider
    let poemMaxWordCountSlider = mustGetElementById('poemMaxWordCountSlider')
    if (!poemMaxWordCountSlider) {
        return
    }
    let wordCount = poemMaxWordCountSlider.value

    // Get max word count slider value div
    let poemCurrentMaxWordCount = mustGetElementById('poemCurrentMaxWordCount')
    if (!poemCurrentMaxWordCount) {
        return
    }
    poemCurrentMaxWordCount.innerHTML = wordCount

}

/**
 * Display error message to user
 */
function renderError(message) {
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

    // Restore UI
    enableUserInput()
}

/**
 * Clear error message shown to user
 */
function clearAnyDisplayedError() {
    renderError('')
}

/**
 * Get list of all togglable user input elements (fields, buttons, etc.)
 */
function getTogglableUiElements() {
    let uiElements = []

    const ids = ['submitButton', 'poemTopicField', 'poemStyleField', 'poemMaxWordCountSlider']

    for (id of ids) {
        let uiElement = mustGetElementById(id)
        if (uiElement) {
            uiElements.push(uiElement)
        }
    }

    return uiElements
}

/**
 * Disable user input (fields, buttons, etc.)
 */
function disableUserInput() {
    let uiElements = getTogglableUiElements();
    for (element of uiElements) {
        element.disabled = true;
    }

    let submitButton = mustGetElementById('submitButton')
    submitButton.innerHTML = 'Generating...'
}

/**
 * Enable user input (fields, buttons, etc.)
 */
function enableUserInput() {
    let uiElements = getTogglableUiElements();
    for (element of uiElements) {
        element.disabled = false;
    }

    let submitButton = mustGetElementById('submitButton')
    submitButton.innerHTML = 'Generate Poem!'

}
