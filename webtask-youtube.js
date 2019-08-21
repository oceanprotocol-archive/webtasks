'use strict' // eslint-disable-line

const express = require('express')
const request = require('request')
const webtask = require('webtask-tools')

const app = express()

const makeRequest = (options, cb) => {
    request(options, (error, response, body) => {
        const json = JSON.parse(body)
        const videos = json.items

        if (error) {
            return cb(error)
        }

        if (json.error) {
            return cb(json.error)
        }

        return cb(videos)
    })
}

app.get('/', (req, res) => {
    res.send(
        'Please use /channel or /playlist endpoints, appended with the channel or playlist ID as parameter.'
    )
})

app.get('/channel/:channelId', (req, res) => {
    const options = {
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${
            req.params.channelId
        }&maxResults=10&order=date&type=video&key=${
            req.webtaskContext.secrets.YOUTUBE_API_KEY
        }`,
        headers: { referer: req.headers.host }
    }

    const parsedPosts = []
    let holder = {}

    makeRequest(options, videos => {
        for (let i = 0; i < videos.length; i++) {
            holder.id = videos[i].id.videoId
            holder.title = videos[i].snippet.title
            holder.description = videos[i].snippet.description
            holder.imageUrl = videos[i].snippet.thumbnails.medium.url
            holder.videoUrl = `https://www.youtube.com/watch?v=${
                videos[i].id.videoId
            }`
            parsedPosts.push(holder)
            holder = {}
        }

        res.send(parsedPosts)
    })
})

app.get('/channel/:channelId/raw', (req, res) => {
    const options = {
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${
            req.params.channelId
        }&maxResults=10&order=date&type=video&key=${
            req.webtaskContext.secrets.YOUTUBE_API_KEY
        }`,
        headers: { referer: req.headers.host }
    }

    makeRequest(options, videos => {
        res.send(videos)
    })
})

app.get('/playlist/:playlistId', (req, res) => {
    const options = {
        url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=10&playlistId=${
            req.params.playlistId
        }&key=${req.webtaskContext.secrets.YOUTUBE_API_KEY}`,
        headers: { referer: req.headers.host }
    }

    const parsedPosts = []
    let holder = {}

    makeRequest(options, videos => {
        for (let i = 0; i < videos.length; i++) {
            holder.id = videos[i].snippet.resourceId.videoId
            holder.title = videos[i].snippet.title
            holder.description = videos[i].snippet.description
            holder.imageUrl = videos[i].snippet.thumbnails.medium.url
            holder.videoUrl = `https://www.youtube.com/watch?v=${
                videos[i].snippet.resourceId.videoId
            }`
            parsedPosts.push(holder)
            holder = {}
        }

        res.send(parsedPosts)
    })
})

app.get('/playlist/:playlistId/raw', (req, res) => {
    const options = {
        url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=10&playlistId=${
            req.params.playlistId
        }&key=${req.webtaskContext.secrets.YOUTUBE_API_KEY}`,
        headers: { referer: req.headers.host }
    }

    makeRequest(options, videos => {
        res.send(videos)
    })
})

module.exports = webtask.fromExpress(app)
