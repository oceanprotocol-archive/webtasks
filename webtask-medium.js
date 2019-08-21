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
        const { posts } = json.payload
        const parsedPosts = []
        let holder = {}

        if (error) return

        for (let i = 0; i < posts.length; i++) {
            holder.id = posts[i].id
            holder.date = posts[i].firstPublishedAt
            holder.readingTime = posts[i].virtuals.readingTime
            holder.title = posts[i].title
            holder.subtitle = posts[i].virtuals.subtitle
            holder.imageUrl = `https://cdn-images-1.medium.com/max/600/${
                posts[i].virtuals.previewImage.imageId
            }`
            holder.postUrl = `https://medium.com/${req.params.username}/${
                posts[i].id
            }`
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
        const { posts } = json.payload

        if (error) return

        res.send(posts)
    })
})

app.get('/:username/followers', (req, res) => {
    const url = `https://medium.com/${req.params.username}?format=json`

    request(url, (error, response) => {
        const json = JSON.parse(response.body.replace('])}while(1);</x>', ''))
        const { collection } = json.payload

        if (error) return

        res.send(`{ "followers": ${collection.metadata.followerCount} }`)
    })
})

app.get('/:username/categories', (req, res) => {
    const url = `https://medium.com/${req.params.username}?format=json`

    request(url, (error, response) => {
        const json = JSON.parse(response.body.replace('])}while(1);</x>', ''))
        const { navItems } = json.payload.collection
        const parsedCategories = []
        let holder = {}

        if (error) return

        for (let i = 0; i < navItems.length; i++) {
            holder.title = navItems[i].title
            holder.url = navItems[i].url
            parsedCategories.push(holder)
            holder = {}
        }

        res.send(parsedCategories)
    })
})

module.exports = webtask.fromExpress(app)
