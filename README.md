In order to test the duplications in webpack bundle. The `app` has project dependency graph like this:

```
.
├── @wtlin1228/editor2 1.0.0
│   └── @wtlin1228/button2 1.3.0
│       └── @wtlin1228/icon 1.1.1
├── @wtlin1228/modal-dialog 1.0.0
│   ├── @wtlin1228/button2 1.3.0
│   │   └── @wtlin1228/icon 1.1.1
│   └── @wtlin1228/icon 2.0.0
├── @wtlin1228/button2 2.5.0
└── @wtlin1228/icon 3.0.0
```

Reproduce steps:

1. `$ cd app`
2. `$ yarn`
3. `$ yarn build`
4. open browser with `http://127.0.0.1:8888/`

Then we will find there are 4 `@wtlin1228/icon` and 3 `@wtlin1228/button` in our bundle. Which could be reduced to 3 and 2 for each.

![icon-bundle-duplications](icon-bundle-duplications.png)

![button-bundle-duplications](button-bundle-duplications.png)
