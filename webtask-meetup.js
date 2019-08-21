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

const baseUrl = 'https://api.meetup.com'

server.get('/', (req, res) => {
    const { MEETUP_API_KEY } = req.webtaskContext.secrets

    const options = {
        url: `${baseUrl}/pro/data-economy/groups?key=${MEETUP_API_KEY}`
    }

    try {
        request.get(options, (error, response, body) => {
            const data = JSON.parse(body)
            let members = []

            if (error) res.send(error)
            if (response.statusCode !== 200) res.send(body)

            if (Array.isArray(data)) {
                for (const item of data) {
                    members.push(item.member_count)
                }

                members = members.reduce((a, b) => a + b, 0)
            }

            res.send({ groups: data, members })
        })
    } catch (error) {
        console.error(error)
        res.send(error)
    }
})

module.exports = Webtask.fromExpress(server)
