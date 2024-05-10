// Karim Fouad 101244311
// Fall 2022

// Click the submit button when the Enter key is pressed
const ENTER = 13
function handleKeyUp(event) {
    event.preventDefault()
    if (event.keyCode === ENTER) {
        let button = mustGetElementById("submitButton")
        if (!button) {
            return
        }
        button.click()
    }
}

function updateMaxWordCount() {
    slider.oninput = function () {
        output.innerHTML = this.value;
    }
}

// Register event handlers
document.addEventListener('DOMContentLoaded', function () {
    let submitButton = mustGetElementById("submitButton")
    if (submitButton) {
        submitButton.addEventListener('click', getPoem)
        document.addEventListener('keyup', handleKeyUp)
    }

    let maxWordSlider = mustGetElementById("poemMaxWordCountSlider")
    if (maxWordSlider) {
        maxWordSlider.oninput = renderMaxWordCount
    }

    // A few essentials on page load
    clearAnyDisplayedError()
    enableUserInput()
    renderMaxWordCount()
})
