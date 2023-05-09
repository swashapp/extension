<div align="center">
    <a href="https://swashapp.io/" target="blank">
        <img src="https://swashapp.io/static/images/logo/swash/s-logo.svg" width="80" alt="Swash Logo" />
    </a>
</div>
<div align="center">
    <b>Swash, reimagining data ownership</b>
</div>

# Swash Extension

This App is a browser extension to captures, pools, and sells user data on his behalf. User data has value. Instead of giving it away for free.

## Table of contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
    - [Technologies](#technologies)
  - [Installation](#installation)
  - [Development](#development)
  - [Deployment](#deployment)
    - [Release](#release)
- [Contact](#contact)
- [License](#license)

## Getting Started

This is an instruction of setting up this project locally. To make it work, get a local copy up and running follow these simple steps.

### Prerequisites

At first step you need a package manager like `yarn` or `npm` to start working on this project. This document used `yarn`, so you can install it by:

```
npm install -g yarn
```

#### Technologies

- Web Extension 6.5.0
- Python 2.x (sqlite3 needed by streamr-client using it)
- libssl1.1 for linux hosts (node-datachannel needed by streamr-client using it)
- React 17.0.2
- Material UI 5.10.6

Notice: libcrypto.so.1.1 is not available on ubuntu 22.04 repository and you should use an earlier version of ubuntu or install it manually.

#### Recommended environment

- Ubuntu 20.04 LTS
- Node 16.x LTS (18.x is not fully tested)
- Installing build essential using ```sudo apt update && sudo apt install build-essential```
- Installing libssl and libcrypto ```sudo apt install libssl1.1```

### Installation

To prepare project dependencies, the only thing that you need is running the following command. Be sure python 2.x is installed on your local.

```
yarn install
```

### Development

After you change the source code, you can compile typescript files to the dist folder in the root directory of the project using `bundle` command. This command support hot-reloading and it applies changes simultaneously.

```
yarn bundle
```

### Deployment

By using this command the extension will be deployed on Firefox. It supports hot reload, so your change will be applied on the extension simultaneously.

_Note:_ For the first time please run `yarn bundle` before using this command.

```
yarn run:firefox
```

Also, there is another command to deploy extension on Chromium.

```
yarn run:chromium
```

#### Release

To create an optimized and minified bundle of the extension you can run `build:prod` command.

```
yarn build:prod
```

## Contact

Just email to dev@swashapp.io or get in touch through social media.

## License

Copyright 2021 Swashapp
