const express = require('express')
const Webtask = require('webtask-tools')
const cors = require('cors')
const crypto = require('crypto')
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

const baseUrl = 'https://us16.api.mailchimp.com/3.0'
const listId = '3c6eed8b71'

const md5 = data => crypto.createHash('md5').update(data).digest('hex')

server.post('/newsletter/:email', (req, res) => {
    const { email } = req.params
    const { MAILCHIMP_API_KEY } = req.webtaskContext.secrets
    const emailDecoded = decodeURIComponent(email)
    const subscriberHash = md5(emailDecoded)

    const baseOptions = {
        url: `${baseUrl}/lists/${listId}/members/${subscriberHash}`,
        'auth': {
            'user': 'oceanprotocol',
            'pass': MAILCHIMP_API_KEY
        }
    }

    const optionsCreate = {
        ...baseOptions,
        json: {
            'email_address': emailDecoded,
            'status': 'pending', // double opt-in
            'merge_fields': {
                // our GDPR fallback
                'GDPR': 'yes'
            }
        }
    }

    const optionsMarketing = marketingPermissionId => (
        {
            ...baseOptions,
            json: {
                'marketing_permissions': [{
                    'marketing_permission_id': marketingPermissionId,
                    'text': 'Email',
                    'enabled': true
                }]
            }
        }
    )

    const addMarketingPermissions = (data, cb) => {
        const marketingPermissionId = data.marketing_permissions[0].marketing_permission_id

        request.patch(optionsMarketing(marketingPermissionId), (error, response, body) => {
            if (error) res.send(error)

            return cb(body)
        })
    }

    // Check if user exists first
    request.get(baseOptions, (error, response, body) => {
        if (error) res.send(error)

        // Member exists and is subscribed
        if (body.status === 'subscribed') {
            // Patch in native GDPR permissions
            addMarketingPermissions(body, () => {
                res.send('{ "status": "exists" }')
            })
        } else {
            // Create user
            request.put(optionsCreate, (error2, response, body2) => {
                if (error2) res.send(error2)

                if (Number.isInteger(body2.status)) {
                    res.send(body2)
                }

                // Patch in native GDPR permissions
                addMarketingPermissions(body2, () => {
                    res.send('{ "status": "created" }')
                })
            })
        }
    })
})

module.exports = Webtask.fromExpress(server)
