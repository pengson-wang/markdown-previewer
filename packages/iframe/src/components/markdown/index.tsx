import { useEffect, useState } from 'react'
import { combineLatest } from 'rxjs'
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators'
import markdown$ from 'states/markdown'
import { useObservable } from 'rxjs-hooks'
import { pluginsObservable, PluginProps, selectedPluginObservable } from 'states/preferences'
import { sleep } from 'utils/async'
import 'highlight.js/styles/github.css'

enum LoadState {
  Loading,
  Loaded,
  Failed,
}

class CSSPluginLoader {
  loadingState: Map<string, LoadState>
  cssCache: Map<string, string>
  constructor() {
    this.loadingState = new Map()
    this.cssCache = new Map()
  }

  async fetchStyle(plugin: PluginProps) {
    if (this.cssCache.has(plugin.id)) {
      return this.cssCache.get(plugin.id)
    }
    if (this.loadingState.has(plugin.id) && this.loadingState.get(plugin.id) === LoadState.Loading) {
      while (this.loadingState.get(plugin.id) === LoadState.Loading) {
        await sleep(200)
      }
      return this.cssCache.get(plugin.id)
    }
    try {
      this.loadingState.set(plugin.id, LoadState.Loading)
      const resp = await fetch(this.tidyURL(plugin.url))
      const text = await resp.text()
      this.cssCache.set(plugin.id, text)
      this.loadingState.set(plugin.id, LoadState.Loaded)
      return text
    } catch (err) {
      this.loadingState.set(plugin.id, LoadState.Failed)
      throw err
    }
  }

  tidyURL(url: string) {
    if (/https?:\/\/github.com/.test(url)) {
      const it = new URL(url)
      const result = /\/?([^\/]+)\/([^\/]+)\/blob\/([\w\W]+)/.exec(it.pathname)
      if (result && result[1] && result[2]) {
        const owner = result[1]
        const repo = result[2]
        const other = result[3]
        return `https://raw.githubusercontent.com/${owner}/${repo}/${other}`
      }
    }
    return url
  }
}

const cssLoader = new CSSPluginLoader()

export const plugin$ = combineLatest([
  pluginsObservable.pipe(shareReplay(1)),
  selectedPluginObservable.pipe(distinctUntilChanged(), shareReplay(1)),
]).pipe(
  map(([plugins, id]) => {
    return id ? plugins[id] : null
  })
)

function MarkdownRenderer() {
  const markdown = useObservable(() => markdown$)
  const [style, setStyle] = useState<string>()
  const [failure, setFailure] = useState<string>()
  useEffect(() => {
    const subscription = plugin$.subscribe((plugin) => {
      const fetchPlugin = async () => {
        if (plugin) {
          try {
            const style = await cssLoader.fetchStyle(plugin)
            setStyle(style)
            setFailure(undefined)
          } catch (err: any) {
            setFailure(err.message ?? 'unknow error')
          }
        } else {
          setStyle('')
        }
      }
      fetchPlugin()
    })
    return () => subscription.unsubscribe()
  }, [])
  return (
    <>
      <link rel="stylesheet" href="./github.min.css"></link>
      <style>{style ?? ''}</style>
      <div id="markdown-renderer" className="markdown markdown-body" style={{ padding: `16px 32px` }}>
        {markdown}
      </div>
    </>
  )
}

export default MarkdownRenderer
