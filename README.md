<div align="center">
    <a href="https://swashapp.io/" target="blank">
        <img src="https://swashapp.io/static/images/logo/swash/s-logo.svg" width="80" alt="Swash Logo" />
    </a>
</div>
<div align="center">
    <b>Swash, reimagining data ownership</b>
</div>

# Extension

## How to develop

All the dependencies are included in to the package.json, the only thing that you need to do is running `yarn install`.

### Bundle

This command will bundle the project and compile typescript files to the dist folder in the root directory of the project.

```
yarn bundle
```

### Development

By using this command the extension will be deployed on Firefox. It supports hot reload, so your change will be applied on the extension simultaneously. 

Note: For the first time please run `yarn bundle` before using this command.

```
yarn dev
```

### Deployment

This command will create a web-ext package from minified bundle of the extension.

```
yarn build
```

## License

Copyright 2021 Swashapp