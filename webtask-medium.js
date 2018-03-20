'use strict' // eslint-disable-line

const express = require('express')
const request = require('request')
const webtask = require('webtask-tools')

const app = express()

app.get('/', (req, res) => {
    res.send('Please enter a username as a parameter')
})

app.get('/:username', (req, res) => {
    const url = `https://medium.com/${req.params.username}/latest?format=json`

    request(url, (error, response) => {
        const json = JSON.parse(response.body.replace('])}while(1);</x>', ''))
        const posts = json.payload.posts // eslint-disable-line prefer-destructuring
        const parsedPosts = []
        let holder = {}

        if (error) {
            return
        }

        for (let i = 0; i < posts.length; i++) {
            holder.id = posts[i].id
            holder.date = posts[i].firstPublishedAt
            holder.readingTime = posts[i].virtuals.readingTime
            holder.title = posts[i].title
            holder.subtitle = posts[i].virtuals.subtitle
            holder.imageUrl = `https://cdn-images-1.medium.com/${posts[i].virtuals.previewImage.imageId}`
            holder.postUrl = `https://medium.com/${req.params.username}/${posts[i].id}`
            parsedPosts.push(holder)
            holder = {}
        }

        res.send(parsedPosts)
    })
})

app.get('/:username/raw', (req, res) => {
    const url = `https://medium.com/${req.params.username}/latest?format=json`

    request(url, (error, response) => {
        const json = JSON.parse(response.body.replace('])}while(1);</x>', ''))
        const posts = json.payload.posts // eslint-disable-line prefer-destructuring

        if (error) {
            return
        }

        res.send(posts)
    })
})

app.listen(4000, () => console.log('Example app listening on localhost:4000!')) // eslint-disable-line no-console

module.exports = webtask.fromExpress(app)
