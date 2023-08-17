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
  - [Build](#build)
    - [Development](#development-build)
    - [Production](#production-build)
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

- Web Extension 7.6.2
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

### Build

#### Development Build

There are multiple script that helps to do a development build based on your browser. The following command (default dev build) will build the extension based on manifest v3 to be used on Chrome.

```
yarn build:dev
```

If you want to build extension for Firefox you can use the following command. It currently works with manifest v2.

```
yarn build:firefox:dev
```

Both of these command support hot reload, so your changes will build simultaneously.

#### Production Build

After being sure about your change you can build a production version using this command. It will generate a minified version of the extension based on manifest v3 for Chrome. 

```
yarn build:prod
```

If you need Firefox production version you can use the following command, it will generate a production built for Firefox based on manifest v2.

```
yarn build:firefox:prod
```

### Deployment

By using this command the built extension from dist directory will be deployed on Chrome. 

_Note:_ For the first time please run one of the [Build](#build) commands before using this command.

```
yarn run
```

For running extension on Firefox please try following command: 

```
yarn run:firefox
```

### Release

To create an optimized and minified bundle of the extension you can run `release` command. It will generate two different version of the extension for Chrome and Firefox in releases directory.

```
yarn release
```

In case you need a version for specific browser you can use one of the following commands based on your desired browse:

```
yarn release:chrome
yarn release:firefox
```

## Contact

Just email to dev@swashapp.io or get in touch through social media.

## License

Copyright 2021 Swashapp
