[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">webtasks</h1>

> 🐬 Ocean Protocol's webtasks doing automatic things for us via webtask.io

![giphy](https://user-images.githubusercontent.com/90316/37671913-0eb2f70a-2c6d-11e8-809e-04d3b40ef1c9.gif)

[![Build Status](https://travis-ci.com/oceanprotocol/webtasks.svg?token=3psqw6c8KMDqfdGQ2x6d&branch=master)](https://travis-ci.com/oceanprotocol/webtasks)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol) [![Greenkeeper badge](https://badges.greenkeeper.io/oceanprotocol/webtasks.svg)](https://greenkeeper.io/)

## Table of Contents

  - [Tasks](#tasks)
     - [Medium](#medium)
     - [YouTube](#youtube)
     - [Bounties](#Bounties)
     - [Zoho](#zoho)
        - [Campaigns API](#campaigns-api)
        - [CRM API](#crm-api)
  - [Development](#development)
  - [Deployment](#deployment)
  - [Authors](#authors)
  - [License](#license)

---

## Tasks

### Medium

**`webtask-medium.js`**: Generic task to fetch and reconstruct items from any medium publication.

Requires the Medium username appended at the end of the url:

```bash
http://localhost:8080/:medium_username

# when published on webtask.io
https://TASK_URL/TASK_NAME/:medium_username
```

### YouTube

**`webtask-youtube.js`**: Generic task to fetch and reconstruct items from any YouTube account. For now, only fetches a playlist. YouTube API key is provided via [secret environment variable](https://webtask.io/docs/issue_parameters) `YOUTUBE_API_KEY` setup in web editor of webtask.io.

Construct your request url like so, e.g. locally:

```bash
http://localhost:8080/:youtube_playlist_id

# when published on webtask.io
https://TASK_URL/TASK_NAME/:youtube_playlist_id
```

### Bounties

**`webtask-bounties.js`**: Task to fetch open bounties on Gitcoin and Bounties.network in one request. Task creates a unified response from fetching both networks.

Construct your `/` request url like so, e.g. locally:

```bash
http://localhost:8080/

# when published on webtask.io
https://TASK_URL/TASK_NAME/
```

Response is structured by network and fills it with whatever comes back from respective API:

```json
{
  "gitcoin": [
    {...}
  ],
  "bountiesNetwork": [
    {...}
  ]
}
```

### Zoho

**`webtask-zoho.js`**: Generic task to subscribe users into lists on Zoho Campaigns & Zoho CRM.

Credentials are provided via [secret environment variables](https://webtask.io/docs/issue_parameters), setup in web editor of webtask.io:

* `ZOHO_CAMPAIGNS_TOKEN`
* `ZOHO_CAMPAIGNS_LIST_KEY`
* `ZOHO_CRM_TOKEN`

#### Campaigns API

* `/newsletter/:data`: subscribes the given email address to the newsletter list on Zoho Campaigns.

The data needs to be in `json` format in the following pattern:

```
{Contact Email:info@oceanprotocol.com}
```

Construct your request url like so, e.g. locally:

```bash
http://localhost:8080/newsletter/:data

# when published on webtask.io
https://TASK_URL/TASK_NAME/newsletter/:data
```

#### CRM API

* `/crm/:data`: subscribes the given email address to the newsletter list on Zoho Campaigns.

The data needs to be in `json` format in the following pattern:

```
{First Name:Jellyfish, Last Name:McJellyfish, Contact Email:info@oceanprotocol.com}
```

Construct your request url like so, e.g. locally:

```bash
http://localhost:8080/crm/:data

# when published on webtask.io
https://TASK_URL/TASK_NAME/crm/:data
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
