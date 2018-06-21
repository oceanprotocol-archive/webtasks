const express = require('express')
const Webtask = require('webtask-tools')
const cors = require('cors')
const proxy = require('http-proxy-middleware')

const server = express()

const config = {
    target: 'https://www.zohoapis.com/crm/v2/',
    changeOrigin: true,
    headers: {
        Authorization: 'Zoho-oauthtoken hello'
    }
}

server.use(cors())
server.use('*', proxy(config))

server.listen(4430)

module.exports = Webtask.fromExpress(server)
