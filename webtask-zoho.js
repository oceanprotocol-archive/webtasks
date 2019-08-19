const express = require('express')
const Webtask = require('webtask-tools')
const cors = require('cors')
const bodyParser = require('body-parser')
const request = require('request')

const server = express()

server.listen(4430)
server.use(bodyParser.json())

//
// Allow requests from these domains only
//
const corsOptions = {
    origin: ['https://oceanprotocol.com', /\.oceanprotocol\.com$/],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
server.use(cors(corsOptions))

//
// Zoho APIs
//
const apiUrlZohoCampaigns = 'https://campaigns.zoho.com/api/'
const apiUrlZohoCRM = 'https://www.zohoapis.com/crm/v2/'

const sendRequest = (options, res) => {
    request(options, (error, response, body) => {
        if (error) res.send(error)

        // just pass through whatever we get from the APIs
        // as the response
        res.send(body)
    })
}

server.get('/', (req, res) => {
    res.send(`
        <h3>Please provide one of these endpoints:</h3>
        - <code>/newsletter/:data</code><br />
        - <code>/crm/:data</code>
    `)
})

//
// Subscribe to newsletter via Zoho Campaigns API
// https://www.zoho.com/campaigns/newhelp/api/contact-subscribe.html
//
server.get('/newsletter', (req, res) => {
    res.send(`
        <h3>Please pass your data in the following format</h3>
        - <code>/newsletter/{Contact Email:info@oceanprotocol.com}</code><br />
    `)
})

server.get('/newsletter/:data', (req, res) => {
    const { ZOHO_CAMPAIGNS_TOKEN, ZOHO_CAMPAIGNS_LIST_KEY } = req.webtaskContext.secrets
    const { data } = req.params

    const options = {
        url: `${apiUrlZohoCampaigns}json/listsubscribe?authtoken=${ZOHO_CAMPAIGNS_TOKEN}&scope=CampaignsAPI&resfmt=JSON&listkey=${ZOHO_CAMPAIGNS_LIST_KEY}&contactinfo=${decodeURIComponent(data)}`
    }
    sendRequest(options, res)
})

//
// Create a new lead via Zoho CRM API
// https://www.zoho.com/crm/help/api/v2/#create-specify-records
//
server.get('/crm', (req, res) => {
    res.send(`<h3>Please pass your data in the following format</h3>
        - <code>/crm/{First Name:First Name, Last Name:Last Name,Contact Email:info@oceanprotocol.com}</code>`)
})

server.get('/crm/:data', (req, res) => {
    const { ZOHO_CRM_TOKEN } = req.webtaskContext.secrets
    const { data } = req.params

    const options = {
        url: `${apiUrlZohoCRM}Leads`,
        headers: { Authorization: `Zoho-oauthtoken ${ZOHO_CRM_TOKEN}` },
        method: 'POST',
        formData: data
    }
    sendRequest(options, res)
})

module.exports = Webtask.fromExpress(server)
