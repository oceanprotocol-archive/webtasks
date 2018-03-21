# Webtasks

> 🐬 Ocean Protocol's webtasks doing automatic things for us via webtask.io

![giphy](https://user-images.githubusercontent.com/90316/37671913-0eb2f70a-2c6d-11e8-809e-04d3b40ef1c9.gif)

[![Build Status](https://travis-ci.com/oceanprotocol/webtasks.svg?token=3psqw6c8KMDqfdGQ2x6d&branch=master)](https://travis-ci.com/oceanprotocol/webtasks)
[![js ascribe](https://img.shields.io/badge/js-ascribe-39BA91.svg)](https://github.com/ascribe/javascript)

## Tasks

**`webtask-medium.js`**: Generic task to fetch and reconstruct items from any medium publication.

Requires the Medium username appended at the end of the url, e.g. locally:

```
http://localhost:8080/MEDIUM_USERNAME
```

When published as a web task, append the taskname followed by the Medium username at the end:

```
https://TASK_URL/TASK_NAME/MEDIUM_USERNAME
```

---

**`webtask-youtube.js`**: Generic task to fetch and reconstruct items from any YouTube account. For now, only fetches a playlist.

Construct your request url like so, e.g. locally:

```
http://localhost:8080/YOUTUBE_PLAYLIST_ID/YOUTUBE_API_KEY
```

Add the task name when published on webtask.io:

```
https://TASK_URL/TASK_NAME/YOUTUBE_PLAYLIST_ID/YOUTUBE_API_KEY
```

## Development

```bash
npm install wt-cli -g
npm start
```

And go to [localhost:8080](http://localhost:8080)

## Deployment

All tasks are running serverless on webtask.io where you can login with your GitHub account. Then interact with it locally with the `wt-cli`:

```bash
npm install wt-cli -g
wt init YOUR_GITHUB_EMAIL

wt create webtask-medium.js --name medium

# make sure it's there and get url
wt ls
```

## Authors

- Matthias Kretschmann ([@kremalicious](https://github.com/kremalicious)) - [BigchainDB](https://www.bigchaindb.com) & [Ocean Protocol](https://oceanprotocol.com)
- initial Medium web task by Pedro Gomes ([@pedrouid](https://github.com/pedrouid)) - [Balance](https://balance.io)

## License

```
Copyright 2018 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
