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

server.get('/', async (req, res) => {
    //
    // OAuth2 Authentication
    //
    const { MEETUP_OAUTH_KEY, MEETUP_OAUTH_SECRET } = req.webtaskContext.secrets

    // Requesting Authorization
    const authOptions = {
        url: `https://secure.meetup.com/oauth2/authorize?client_id=${MEETUP_OAUTH_KEY}&redirect_uri=https://oceanprotocol.com&response_type=anonymous_code`
    }

    const code = await request.get(authOptions, (error, response, body) => {
        if (error) res.send(error)
        console.log(body)
        return JSON.parse(body).code
    })

    // Requesting Access Token
    const tokenAuthOptions = {
        url: `https://secure.meetup.com/oauth2/access?client_id=${MEETUP_OAUTH_KEY}&client_secret=${MEETUP_OAUTH_SECRET}&grant_type=anonymous_code&redirect_uri=https://oceanprotocol.com&code=${code}`
    }
    const token = request.post(tokenAuthOptions, (error, response, body) => {
        if (error) res.send(error)
        console.log(body)
        return JSON.parse(body).access_token
    })

    const options = {
        url: `${baseUrl}/pro/data-economy/groups?access_token=${token}`
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
