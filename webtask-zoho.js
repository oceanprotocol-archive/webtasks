const express = require('express')
const Webtask = require('webtask-tools')
const cors = require('cors')
const proxy = require('http-proxy-middleware')

const server = express()

const onProxyReq = function (proxyReq, req) {
    proxyReq.setHeader('Authorization', `Zoho-oauthtoken ${req.webtaskContext.secrets.ZOHO_TOKEN}`)
}

const configZohoCRM = {
    target: 'https://www.zohoapis.com/crm/v2/',
    pathRewrite: { '^/zoho/crm/': '/' },
    changeOrigin: true,
    onProxyReq
}

const configZohoCampaigns = {
    target: 'https://campaigns.zoho.com/api/',
    pathRewrite: { '^/zoho/campaigns/': '/' },
    changeOrigin: true,
    onProxyReq
}

server.use(cors())
// server.use('*', proxy(config))
server.use(proxy('/zoho/crm/**', configZohoCRM))
server.use(proxy('/zoho/campaigns/**', configZohoCampaigns))

server.listen(4430)

module.exports = Webtask.fromExpress(server)
