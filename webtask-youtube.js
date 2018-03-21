'use strict' // eslint-disable-line

const express = require('express')
const request = require('request')
const webtask = require('webtask-tools')

const app = express()

app.get('/', (req, res) => {
    res.send('Please specify the playlist ID and API key.')
})

app.get('/:playlist/:apikey', (req, res) => {
    const options = {
        url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${req.params.playlist}&key=${req.params.apikey}`,
        headers: { 'referer': req.headers.host }
    }

    request(options, (error, response, body) => {
        const json = JSON.parse(body)
        const videos = json.items // eslint-disable-line prefer-destructuring
        const parsedPosts = []

        let holder = {}

        if (error) {
            return
        }

        for (let i = 0; i < videos.length; i++) {
            holder.id = videos[i].snippet.resourceId.videoId
            holder.title = videos[i].snippet.title
            holder.description = videos[i].snippet.description
            holder.imageUrl = videos[i].snippet.thumbnails.medium.url
            holder.videoUrl = `https://www.youtube.com/watch?v=${videos[i].snippet.resourceId.videoId}`
            parsedPosts.push(holder)
            holder = {}
        }

        res.send(parsedPosts)
    })
})

app.get('/:playlist/:apikey/raw', (req, res) => {
    const options = {
        url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${req.params.playlist}&key=${req.params.apikey}`,
        headers: { 'referer': req.headers.host }
    }

    request(options, (error, response, body) => {
        const json = JSON.parse(body)

        if (error) {
            return
        }

        res.send(json.items)
    })
})

module.exports = webtask.fromExpress(app)