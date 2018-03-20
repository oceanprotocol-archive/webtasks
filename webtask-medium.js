var express = require("express");
var request = require("request");
var webtask = require("webtask-tools");
var app = express();

app.get('/', function (req, res) {
    res.send('Please enter a username as a parameter');
})

app.get("/:username", function (req, res) {
    var url = `https://medium.com/${req.params.username}/latest?format=json`;

    request(url, function (error, response, html) {
        if (error) {
            console.log(error);
            return;
        }
        var json = JSON.parse(response.body.replace("])}while(1);</x>", ""));
        var posts = json.payload.posts;
        var parsedPosts = [];
        var holder = {};
        for (var i = 0; i < posts.length; i++) {
            holder.id = posts[i].id;
            holder.date = posts[i].firstPublishedAt;
            holder.readingTime = posts[i].virtuals.readingTime;
            holder.title = posts[i].title;
            holder.subtitle = posts[i].virtuals.subtitle;
            holder.imageUrl =
                "https://cdn-images-1.medium.com/" +
                posts[i].virtuals.previewImage.imageId;
            holder.postUrl = "https://medium.com/" + req.params.username + "/" + posts[i].id;
            parsedPosts.push(holder);
            holder = {};
        }
        res.send(parsedPosts);
    });
});

app.get("/:username/raw", function (req, res) {
    var url = `https://medium.com/${req.params.username}/latest?format=json`;

    request(url, function (error, response, html) {
        if (error) {
            console.log(error);
            return;
        }
        var json = JSON.parse(response.body.replace("])}while(1);</x>", ""));
        var posts = json.payload.posts;
        res.send(posts);
    });
});

module.exports = webtask.fromExpress(app);
