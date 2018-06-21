const express = require('express')
const Webtask = require('webtask-tools')
const cors = require('cors')
const proxy = require('http-proxy-middleware')
const bodyParser = require('body-parser')
const request = require('request')

const server = express()

server.use(cors())
server.listen(4430)
server.use(bodyParser.json())

const apiUrlZohoCampaigns = 'https://campaigns.zoho.com/api/'
const apiUrlZohoCRM = 'https://www.zohoapis.com/crm/v2/'

//
// Subscribe to newsletter via Zoho Campaigns API
// https://www.zoho.com/campaigns/newhelp/api/contact-subscribe.html
//
server.get('/newsletter/:data', (req, res) => {
    const { ZOHO_CAMPAIGNS_TOKEN, ZOHO_CAMPAIGNS_LIST_KEY } = req.webtaskContext.secrets
    const { data } = req.params

    const options = {
        url: `${apiUrlZohoCampaigns}json/listsubscribe?authtoken=${ZOHO_CAMPAIGNS_TOKEN}&scope=CampaignsAPI&resfmt=JSON&listkey=${ZOHO_CAMPAIGNS_LIST_KEY}&contactinfo=${data}` // eslint-disable-line max-len
    }

    request(options, (error, response, body) => { // eslint-disable-line consistent-return
        if (error) {
            res.send(error)
        }

        res.send(body)
        res.sendStatus(200)
    })
})

const onProxyReqZohoCRM = (proxyReq, req) => {
    const { ZOHO_CRM_TOKEN } = req.webtaskContext.secrets

    proxyReq.setHeader('Authorization', `Zoho-oauthtoken ${ZOHO_CRM_TOKEN}`)
}

const configZohoCRM = {
    target: apiUrlZohoCRM,
    pathRewrite: { '^/zoho/crm/': '/' },
    changeOrigin: true,
    onProxyReq: onProxyReqZohoCRM
}

server.use(proxy('/zoho/crm/**', configZohoCRM))

module.exports = Webtask.fromExpress(server)
