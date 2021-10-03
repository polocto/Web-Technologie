const express = require('express')
const app = express()
const config = {
    port: 3000
}
const data = {
    channels: [{
        id: '1',
        name: 'Channel 1',
    }, {
        id: '2',
        name: 'Channel 2',
    }, {
        id: '3',
        name: 'Channel 3',
    }]
}

app.get('/', (req, res) => {
    // Project homepage
    // Return some HTML content inside `body` with:
    // * The page title
    // * A link to the `/channels` page
    // Don't bother with the `head` tag
})

app.get('/channels', (req, res) => {
    // List of channels
    // Return some HTML content inside `body` with:
    // * The page title
    // * A list of every channel with a link to the channel page
    // Notes:
    // * Channels are identified by channel ids.
    // * Make sure to find the appropriate HTML tag to respect the HTML semantic
    //   of a list
})

app.get('/channel/:id', (req, res) => {
    // Channel information
    // Print the channel title
})

app.listen(config.port, () => {
    console.log(`Chat is waiting for you at http://localhost:${config.port}`)
})