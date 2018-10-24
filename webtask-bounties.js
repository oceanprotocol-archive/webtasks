'use latest'

const express = require('express')
const axios = require('axios')
const webtask = require('webtask-tools')
const regeneratorRuntime = require('regenerator-runtime') // eslint-disable-line

const server = express()

async function getGitcoin() {
    try {
        const response = await axios.get('https://gitcoin.co/api/v0.1/bounties/')

        const gitcoinBody = response.data // returns only open bounties by default
        const gitcoin = gitcoinBody.filter(
            // filter the response manually, no way atm to do that as API query
            item => item.funding_organisation.includes('Ocean Protocol')
        )

        const data = { gitcoin: gitcoin.length }

        return data
    } catch (error) {
        console.error(`Error: ${error.reason}`) // eslint-disable-line no-console
    }
}

async function getBountiesNetwork() {
    try {
        const response = await axios.get('https://api.bounties.network/bounty/?search=ocean%20protocol&bountyStage=1&platform=bounties-network')

        const bountiesNetwork = response.data
        const data = { bountiesNetwork: bountiesNetwork.results.length }
        return data
    } catch (error) {
        console.error(`Error: ${error.reason}`) // eslint-disable-line no-console
    }
}

server.get('/', async (req, res) => {
    try {
        const dataGitcoin = await getGitcoin()
        const dataBountiesNetwork = await getBountiesNetwork()
        const data = Object.assign(dataGitcoin, dataBountiesNetwork)

        res.send(data)
    } catch (error) {
        res.send(error)
    }
})

module.exports = webtask.fromExpress(server)
