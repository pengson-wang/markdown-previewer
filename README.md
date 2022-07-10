# Markdown Previewer

[Markdown Previewer](https://chrome.google.com/webstore/detail/markdown-previewer/pkafcdoobiajoadnphldaglkoadicmgd) is a chrome extension that starts a previewer along side with the github default editor.

# Roadmap

- [x] display images in the repo according to its path not URL.
- [ ] ~~support [github emoji](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)~~
- [ ] private repo
- [ ] ~~mermaid chart~~
- [x] theme as plugin
- [ ] theme market

Removed items such as `support of github emoji` because that the capability of renderere will be full handled by the renderer itself. The renderere is actually loaded as a plugin. Read more at [#plugin](Plugin).

# Plugin
The idea that use external plugin (just for renderer purpose) as the markdown renderer is to release the power of customiza the previewer part as much as possible. With the flexibilty with plugin, people doesn't need different extension but only this the `Markdown Previewer` with just different renderers.

## How to make your own plugin?
Follow the sample here https://github.com/pengson-wang/markdown-renderers. The key point of making a plugin are as following:
1. Pack your plugin as a web-component
2. expose a function name called `setup`. 

This function will be executed by the renderer-container(one of the core runs by the Markdown Previewer)
```
function setup(tagName: string) {
  // Register the custom element.
  // After registration, all `<my-vue-element>` tags
  // on the page will be upgraded.
  customElements.define(tagName, MyWebComponents)
}

if (typeof window === 'object') {
  //@ts-ignore
  window.setup_markdown_renderer = setup
}
```

More details about the component props please read the code in the sample.

It's ok to use any other tech stacks that match the above points. Have fun!

# LICENSE

MIT
