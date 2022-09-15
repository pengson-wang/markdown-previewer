# Extension(Iframe)

This is the previewer than being loaded as iframe.

# Development

## about list-of-highlight.js

The previewer contains the built in highlight themes provided by [highlight.js](https://highlightjs.org/). In order to allow the user select highlight themes, the previewer display a list of theme names as form select. And this `list-of-highlight.js` is the script to figure out the avaiable themes and save it as json configuration in `src` folder.

At the root of this folder, execute the script:

```bash
node list-of-highlight.js
```

It creates a file at `src/constants/highlight-theme.json`, the content is like:

```json
[
  {
    "path": "a11y-dark.css",
    "name": "a11y dark"
  },
  {
    "path": "a11y-light.css",
    "name": "a11y light"
  },
  {
    "path": "agate.css",
    "name": "agate"
  },
  {
    "path": "an-old-hope.css",
    "name": "an old hope"
  },
  ...
]
```
