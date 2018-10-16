'use strict' // eslint-disable-line

const express = require('express')
const request = require('request')
const webtask = require('webtask-tools')

const app = express()

// Just chained callbacks in lack of proper async/await support on webtask.io
app.get('/', (req, res) => {

    // Gitcoin bounties
    request('https://gitcoin.co/api/v0.1/bounties/', (error, response, body) => {
        if (error) return error

        const gitcoinBody = JSON.parse(body) // returns only open bounties by default
        const gitcoin = gitcoinBody.filter(
            // filter the response manually, no way atm to do that as API query
            item => item.funding_organisation.includes('Ocean Protocol')
        )

        let holder = {}

        holder.gitcoin = gitcoin
        
        // Bounties.network bounties
        request('https://new.api.bounties.network/bounty/?search=ocean%20protocol&bountyStage=1', (error, response, body) => {
            if (error) return

            const bountiesNetwork = JSON.parse(body)
            holder.bountiesNetwork = bountiesNetwork.results

            // Send final response
            res.send(holder)
        })
    })
})

module.exports = webtask.fromExpress(app)
