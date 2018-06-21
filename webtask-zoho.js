const express = require('express')
const Webtask = require('webtask-tools')
const cors = require('cors')
const bodyParser = require('body-parser')
const request = require('request')

const server = express()

server.use(cors())
server.listen(4430)
server.use(bodyParser.json())

//
// Zoho API urls
//
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

    request(options, (error, response, body) => {
        if (error) {
            res.send(error)
        }

        res.send(body)
        res.sendStatus(200)
    })
})

//
// Create a new lead via Zoho CRM API
// https://www.zoho.com/crm/help/api/v2/#create-specify-records
//
server.get('/crm/:data', (req, res) => {
    const { ZOHO_CRM_TOKEN } = req.webtaskContext.secrets
    const { data } = req.params

    const options = {
        url: `${apiUrlZohoCRM}Leads`, // eslint-disable-line max-len
        headers: { 'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_TOKEN}` },
        method: 'POST',
        formData: data
    }

    request(options, (error, response, body) => {
        if (error) {
            res.send(error)
        }

        res.send(body)
        res.sendStatus(200)
    })
})

module.exports = Webtask.fromExpress(server)
