import { useState, useCallback, useEffect } from 'react'
import { combineLatest } from 'rxjs'
import { distinctUntilChanged, map, filter } from 'rxjs/operators'
import { sendReadySignal, $owner, $repo } from 'states/general'
import { $branch } from 'states/github'
import markdown$ from 'states/markdown'
import { useObservable } from 'rxjs-hooks'
import { InputMsgForRenderer } from 'shared'
import { plugins$, selectedPlugin$, PluginProps } from 'states/preferences'

enum LoadState {
  Loading,
  Loaded,
  Failed,
}

class PluginsLoader {
  cache: Record<string, LoadState>
  constructor() {
    this.cache = {}
  }

  async load(plugin: PluginProps, tagName = `markdown-renderer-${plugin.id}`) {
    if (this.cache[plugin.id] === LoadState.Loading || this.cache[plugin.id] === LoadState.Loaded) {
      return tagName
    }
    try {
      this.cache[plugin.id] = LoadState.Loading
      const resp = await fetch(plugin.url)
      const text = await resp.text()

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.text = text
      document.body.appendChild(script)
      //@ts-ignore
      window.setup_markdown_renderer(tagName)

      this.cache[plugin.id] = LoadState.Loaded
    } catch (err) {
      this.cache[plugin.id] = LoadState.Failed
      throw err
    } finally {
      return tagName
    }
  }
  isLoaded(plugin: PluginProps) {
    return this.cache[plugin.id] === LoadState.Loaded
  }
  isLoading(plugin: PluginProps) {
    return this.cache[plugin.id] === LoadState.Loading
  }
}

const pluginLoader = new PluginsLoader()

const plugin$ = combineLatest([plugins$, selectedPlugin$.pipe(distinctUntilChanged())]).pipe(
  map(([plugins, id]) => {
    return id ? plugins[id] : null
  }),
  filter((p) => !!p),
  map((p) => p as PluginProps)
)

function pluginToTag(plugin: PluginProps) {
  return `markdown-renderer-${plugin.id}`
}

plugin$.subscribe((plugin) => {
  if (pluginLoader.isLoading(plugin) || pluginLoader.isLoaded(plugin)) {
    console.debug('skip load plugin since it is loading or loaded')
  } else {
    pluginLoader.load(plugin, pluginToTag(plugin)).catch((err) => {
      alert(err)
    })
  }
})

const tag$ = plugin$.pipe(map((p) => pluginToTag(p)))

const msg$ = combineLatest([$owner, $repo, $branch, markdown$.pipe(distinctUntilChanged())]).pipe(
  map(([owner, repo, branch, markdown]) => {
    return {
      markdown: markdown,
      metadata: {
        owner,
        repo,
        branch,
      },
    } as InputMsgForRenderer
  })
)

function Home() {
  const msg = useObservable(() => msg$)
  const Tag = useObservable(() => tag$, 'div')

  useEffect(() => {
    sendReadySignal()
  }, [])

  return (
    <div
      id="renderer-box"
      css={`
        padding: 24px;
      `}>
      <Tag markdown={msg?.markdown} />
    </div>
  )
}

export default Home
