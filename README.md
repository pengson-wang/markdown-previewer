# Markdown Previewer

[Markdown Previewer](https://chrome.google.com/webstore/detail/markdown-previewer/pkafcdoobiajoadnphldaglkoadicmgd) is a chrome extension that starts a previewer along side with the github default editor.

# Roadmap

- [x] display images in the repo according to its path not URL.
- [ ] ~~support [github emoji](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)~~
- [ ] private repo
- [ ] ~~mermaid chart~~
- [x] css theme as plugin
- [ ] theme market

Removed items such as `support of github emoji` because that the capability of renderere will be full handled by the renderer itself. The renderere is actually loaded as a plugin. Read more at [#plugin](Plugin).

# Theme

Since the security policy of Chrome Web Store the idea of plugin(using JavaScript) was abandoned. Instead, the extension is going to support css theme as plugin. I've put a theme at https://github.com/pengson-wang/markdown-css-themes and its url was saved in the extension as a built in plugin(I'm considering to change the label to theme) . When the extension is installed and you have enabled the plugin, the extension will try to download the content at that endpint and apply the style to the markdown.

If you want to import any theme into the extension make sure you follow the rules as:

1. the css selector should like https://github.com/pengson-wang/markdown-css-themes or https://github.com/sindresorhus/github-markdown-css. I'm planing to create a editor so that you can easiler verify if the css works as expected.
2. Make sure the url you paste to the plugin are the directly url that offer the raw text. For example this https://raw.githubusercontent.com/pengson-wang/markdown-css-themes/main/themes/github.css is perfect. And https://github.com/pengson-wang/markdown-css-themes/blob/main/themes/github.css is not.

# Plugin (Deprecated)

> Since the security policy of Chrome Web Store the idea of plugin(using JavaScript) was abandoned. Instead, the extension is going to support css theme as plugin.

> I'm still considering to ship this extension without the help of Chrome Web Store. e.g. via zip in the release page.

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
