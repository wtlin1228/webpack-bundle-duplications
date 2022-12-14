### Problem

In order to test the duplications in webpack bundle. The `app` has project dependency graph like this:

`$ yarn list --pattern @wtlin1228`

```
.
├── @wtlin1228/editor2 1.0.0
│   └── @wtlin1228/button2 1.3.0 (duplicate)
│       └── @wtlin1228/icon 1.1.1 (duplicate)
├── @wtlin1228/modal-dialog 1.0.0
│   ├── @wtlin1228/button2 1.4.0 (duplicate)
│   │   └── @wtlin1228/icon 1.99.1 (duplicate)
│   └── @wtlin1228/icon 2.0.0
├── @wtlin1228/button2 2.5.0
└── @wtlin1228/icon 3.0.0
```

Then we will find there are 4 `@wtlin1228/icon` and 3 `@wtlin1228/button` inside our webpack bundle. Which could be reduced to 3 and 2 for each.

![icon-bundle-duplications](icon-bundle-duplications.png)

![button-bundle-duplications](button-bundle-duplications.png)

### Reproduce Steps

Reproduce steps:

1. `$ cd app-with-yarn`
2. `$ yarn`
3. `$ yarn build`
4. open browser with `http://127.0.0.1:8888/`

### With `DeduplicateWebpackPlugin`

Use `DeduplicateWebpackPlugin` to deduplicate the bundle. In my experimental tool project `/app`. The bundle size increased by `node_modules/@wtlin1228` is reduced by **20.5%**. So, that could be a good optimization for more complex projects.

```js
// webpack config
const config = {
  // ...

  plugins: [
    // ...

    new DeduplicateWebpackPlugin({
      cacheDir: path.resolve(__dirname, "webpack-cache"),
      rootPath: path.resolve(__dirname),
      packageManager: "yarn",
    }),

    // ...
  ],

  // ...
};
```

![icon-bundle-deduplications](icon-bundle-deduplications.png)

![button-bundle-deduplications](button-bundle-deduplications.png)

### Webpack Plugins trying to solve this problem

- https://github.com/atlassian-labs/webpack-deduplication-plugin
- https://github.com/FormidableLabs/inspectpack/#fixing-bundle-duplicates
- https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin
- https://github.com/zillow/webpack-stats-duplicates
- https://github.com/team-griffin/webpack-dedupe-plugin

### Blog Post

- https://www.developerway.com/posts/webpack-and-yarn-magic-against-duplicates-in-bundles
