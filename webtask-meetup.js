const express = require('express')
const Webtask = require('webtask-tools')
const cors = require('cors')
const bodyParser = require('body-parser')
const request = require('request')
const axios = require('axios')

const server = express()

require('dotenv').config()

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

const oAuthFlow = async () => {
    //
    // OAuth2 Authentication
    //
    // const { MEETUP_OAUTH_KEY, MEETUP_OAUTH_SECRET } = req.webtaskContext.secrets
    const {
        MEETUP_OAUTH_KEY,
        MEETUP_OAUTH_SECRET,
        MEETUP_EMAIL,
        MEETUP_PASSWORD
    } = process.env

    // Requesting Authorization
    const authOptions = {
        url: `https://secure.meetup.com/oauth2/authorize?client_id=${MEETUP_OAUTH_KEY}&redirect_uri=/&response_type=anonymous_code`,
        headers: {
            Accept: 'application/json'
        }
    }
    const response = await axios(authOptions)
    console.log(response.data)

    // Requesting Access Token
    // const tokenAuthOptions = {
    //     url: `https://secure.meetup.com/oauth2/access?client_id=${MEETUP_OAUTH_KEY}&client_secret=${MEETUP_OAUTH_SECRET}&grant_type=anonymous_code&redirect_uri=https://oceanprotocol.com&code=${code}`,
    //     method: 'POST'
    // }
    // const accessToken = await axios(tokenAuthOptions).access_token

    // // Send user credentials
    // const userAuthOptions = {
    //     url: `https://api.meetup.com/sessions?&email=${MEETUP_EMAIL}&password=${MEETUP_PASSWORD}`,
    //     method: 'POST',
    //     headers: {
    //         Authorization: `Bearer ${accessToken}`
    //     }
    // }

    // const oauthToken = await await axios(userAuthOptions).oauth_token

    // return oauthToken
}

server.get('/', async (req, res) => {
    const oauthToken = await oAuthFlow()

    const options = {
        url: `${baseUrl}/pro/data-economy/groups?access_token=${oauthToken}`
    }

    try {
        request.get(options, (error, response, body) => {
            const data = JSON.parse(body)
            let members = []

            if (error) res.send(error.error_description)
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
        console.error(error.error_description)
        res.send(error.error_description)
    }
})

module.exports = Webtask.fromExpress(server)
