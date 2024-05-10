// Karim Fouad 101244311
// Fall 2022

/**
 * Send a poem generation request to our server, given topic and style
 */
function requestNewPoem(topic, style, maxWordCount) {
    let request = new XMLHttpRequest()

    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            let response = JSON.parse(request.responseText)
            console.log(`response (${request.status}):`, response);

            if (request.status == 200) {
                renderPoem(response.poem);
            }

            if (request.status >= 500) {
                let errorMessage = "Error: " + response.message + ". Please try again."
                renderError(errorMessage);
            }
        }
    }

    let query = `/poem?topic=${topic}&style=${style}&maxWordCount=${maxWordCount}`

    request.open('GET', query, true)
    request.send()
}

/**
 * Ask our server to write new poem using the given topic and style
 * indicated by the user text fields
 */
function getPoem() {
    // Get poem topic
    let poemTopicField = mustGetElementById('poemTopicField')
    if (!poemTopicField) {
        return
    }
    topic = poemTopicField.value.trim()

    // Get poem style
    let poemStyleField = mustGetElementById('poemStyleField')
    if (!poemStyleField) {
        return
    }
    style = poemStyleField.value.trim()

    // Get poem max word count
    let poemMaxWordCount = mustGetElementById('poemMaxWordCountSlider')
    if (!poemMaxWordCount) {
        return
    }
    let maxWordCount = poemMaxWordCount.value

    clearAnyDisplayedError()
    disableUserInput()
    requestNewPoem(topic, style, maxWordCount)
}
