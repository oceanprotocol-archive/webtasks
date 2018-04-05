'use strict' // eslint-disable-line

const express = require('express')
const axios = require('axios')
const webtask = require('webtask-tools')

const app = express()

app.get('/', (req, res) => {
    res.send('Please specify the list ID and use POST request.')
})

app.get('/:list/:data', (req, res) => {
    const options = {
        method: 'post',
        url: `https://api2.moonmail.io/lists/${req.params.list}/recipients`,
        headers: { 'x-api-key': req.webtaskContext.secrets.MOONMAIL_API_KEY },
        data: req.params.data,
    }

    axios(options)
        .then(response => {
            res.send(response)
        })
        .catch(error => {
            res.send(error)
        })
})

module.exports = webtask.fromExpress(app)
