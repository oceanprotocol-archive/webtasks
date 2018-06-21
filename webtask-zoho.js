const express = require('express')
const Webtask = require('webtask-tools')
const cors = require('cors')
const proxy = require('http-proxy-middleware')

const server = express()

const onProxyReqZohoCRM = (proxyReq, req) => {
    const { ZOHO_CRM_TOKEN } = req.webtaskContext.secrets

    proxyReq.setHeader('Authorization', `Zoho-oauthtoken ${ZOHO_CRM_TOKEN}`)
}

const onProxyReqZohoCampaigns = (proxyReq, req) => {
    const { ZOHO_CAMPAIGNS_TOKEN, ZOHO_CAMPAIGNS_LIST_KEY } = req.webtaskContext.secrets

    //
    // Auth via query params
    // https://www.zoho.com/campaigns/newhelp/api/contact-subscribe.html
    //
    proxyReq.path += `?authtoken=${ZOHO_CAMPAIGNS_TOKEN}&scope=CampaignsAPI&resfmt=JSON&listkey=${ZOHO_CAMPAIGNS_LIST_KEY}&contactinfo={First Name:mac,Last Name:Last Name,Contact Email:jai@zoho.com}` // eslint-disable-line max-len
}

const configZohoCRM = {
    target: 'https://www.zohoapis.com/crm/v2/',
    pathRewrite: { '^/zoho/crm/': '/' },
    changeOrigin: true,
    onProxyReq: onProxyReqZohoCRM
}

const configZohoCampaigns = {
    target: 'https://campaigns.zoho.com/api/',
    pathRewrite: { '^/zoho/campaigns/': '/' },
    changeOrigin: true,
    onProxyReq: onProxyReqZohoCampaigns
}

server.use(cors())
// server.use('*', proxy(config))
server.use(proxy('/zoho/crm/**', configZohoCRM))
server.use(proxy('/zoho/campaigns/**', configZohoCampaigns))

server.listen(4430)

module.exports = Webtask.fromExpress(server)
