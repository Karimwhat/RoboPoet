// Karim Fouad 101244311
// Fall 2022

// Uses OpenAI documentation at:
// https://beta.openai.com/docs/libraries/node-js-library

const openai = require("openai");

// Karim's OpenAI API key
//
// Please don't share my key with others
//
// Please don't violate OpenAI's usage policies while using my key
// See https://beta.openai.com/docs/usage-policies
//
// You can also set your own key by setting OPENAI_API_KEY environment
// variable before launching the server. For example:
//
//  Linux or macOS:
//    export OPENAI_API_KEY="###"
//    node server.js
//
//  Windows (PowerShell):
//    $env:OPENAI_API_KEY="###"
//    node server.js
//
const KARIM_API_KEY = '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'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || KARIM_API_KEY

// Configure OpenAI to use the API key
const apiConfiguration = new openai.Configuration({
    apiKey: OPENAI_API_KEY,
})
const api = new openai.OpenAIApi(apiConfiguration)

/**
 *
 * Ask OpenAI to generate text based on a given `prompt` string
 *
 * The `creativity` factor is 0-1 (float).
 * The `maxWordCount` should not exceed 2000.
 *
 * Returns a response object that looks like:
 *
 *    ```
 *    {
 *      data: {
 *          choices: [
 *              {
 *                  text: "The AI-generated text",
 *                  ...
 *              },
 *              ...
 *          ],
 *          ...
 *      },
 *      ...
 *    }
 *    ```
 *
 * Note that this is an async function, so to use it
 * correctly, you must resolve its promise or use
 * the `await` keyword, like so:
 *
 *   `let response = await ask(prompt)`
 *
 */
async function ask(prompt, maxWordCount = 20, creativity = 0.9) {
    const response = await api.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: creativity,
        max_tokens: maxWordCount,
    })

    return response
}


/**
 * Export variables and functions that other files should be able to access.
 *
 * Example:
 *    const openai = require('./openai.js')
 *    const response = await openai.ask(...)
 *
 * Unexported variables and functions remain hidden from other files
 *
 * Example:
 *    const openai = require('./openai.js')
 *    console.log(openai.OPENAI_API_KEY) // ERROR
 *
 */
module.exports = {
    ask,
    //...
}
