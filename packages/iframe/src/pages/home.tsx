import ReactDOM from 'react-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { combineLatest } from 'rxjs'
import { distinctUntilChanged, map, filter, shareReplay } from 'rxjs/operators'
import { sendReadySignal, $owner, $repo } from 'states/general'
import { $branch } from 'states/github'
import markdown$ from 'states/markdown'
import { useObservable } from 'rxjs-hooks'
import { InputMsgForRenderer } from 'shared'
import { pluginsObservable, selectedPluginObservable, PluginProps } from 'states/preferences'
import { processor } from 'utils/markdown'

enum LoadState {
  Loading,
  Loaded,
  Failed,
}

// class PluginsLoader {
//   cache: Record<string, LoadState>
//   constructor() {
//     this.cache = {}
//   }

//   async load(plugin: PluginProps, tagName = `markdown-renderer-${plugin.id}`) {
//     if (this.cache[plugin.id] === LoadState.Loading || this.cache[plugin.id] === LoadState.Loaded) {
//       return tagName
//     }
//     try {
//       this.cache[plugin.id] = LoadState.Loading
//       const resp = await fetch(plugin.url)
//       const text = await resp.text()

//       const script = document.createElement('script')
//       script.type = 'text/javascript'
//       script.text = text
//       document.body.appendChild(script)
//       //@ts-ignore
//       window.setup_markdown_renderer(tagName)

//       this.cache[plugin.id] = LoadState.Loaded
//     } catch (err) {
//       this.cache[plugin.id] = LoadState.Failed
//       throw err
//     } finally {
//       return tagName
//     }
//   }
//   isLoaded(plugin: PluginProps) {
//     return this.cache[plugin.id] === LoadState.Loaded
//   }
//   isLoading(plugin: PluginProps) {
//     return this.cache[plugin.id] === LoadState.Loading
//   }
// }

// const pluginLoader = new PluginsLoader()

// const plugin$ = combineLatest([plugins$.pipe(shareReplay(1)), selectedPlugin$.pipe(distinctUntilChanged(), shareReplay(1))]).pipe(
//   map(([plugins, id]) => {
//     return id ? plugins[id] : null
//   }),
//   filter((p) => !!p),
//   map((p) => p as PluginProps)
// )

// function pluginToTag(plugin: PluginProps) {
//   return `markdown-renderer-${plugin.id}`
// }

// plugin$.subscribe((plugin) => {
//   if (pluginLoader.isLoading(plugin) || pluginLoader.isLoaded(plugin)) {
//     console.debug('skip load plugin since it is loading or loaded')
//   } else {
//     pluginLoader.load(plugin, pluginToTag(plugin)).catch((err) => {
//       alert(err)
//     })
//   }
// })

// const tag$ = plugin$.pipe(map((p) => pluginToTag(p)))

class CSSPluginLoader {
  cache: Record<string, LoadState>
  constructor() {
    this.cache = {}
  }

  async load(plugin: PluginProps) {
    if (this.cache[plugin.id] === LoadState.Loading || this.cache[plugin.id] === LoadState.Loaded) {
      return true
    }
    try {
      this.cache[plugin.id] = LoadState.Loading
      const resp = await fetch(plugin.url)
      const text = await resp.text()

      const exists = document.querySelector('#markdown-renderer-style')
      if (exists) {
        exists.remove()
      }

      const style = document.createElement('style')
      style.id = 'markdown-renderer-style'
      style.textContent = text
      document.head.appendChild(style)

      this.cache[plugin.id] = LoadState.Loaded
    } catch (err) {
      this.cache[plugin.id] = LoadState.Failed
      throw err
    }
  }
  async fetchStyle(plugin: PluginProps) {
    try {
      const resp = await fetch(plugin.url)
      const text = await resp.text()
      return text
    } catch (err) {
      throw err
    }
  }
  isLoaded(plugin: PluginProps) {
    return this.cache[plugin.id] === LoadState.Loaded
  }
  isLoading(plugin: PluginProps) {
    return this.cache[plugin.id] === LoadState.Loading
  }
}

const cssLoader = new CSSPluginLoader()

const plugin$ = combineLatest([
  pluginsObservable.pipe(shareReplay(1)),
  selectedPluginObservable.pipe(distinctUntilChanged(), shareReplay(1)),
]).pipe(
  map(([plugins, id]) => {
    return id ? plugins[id] : null
  }),
  filter((p) => !!p),
  map((p) => p as PluginProps)
)

// plugin$.subscribe((plugin) => {
//   if (cssLoader.isLoading(plugin) || cssLoader.isLoaded(plugin)) {
//     console.debug('skip load plugin since it is loading or loaded')
//   } else {
//     cssLoader.load(plugin).catch((err) => {
//       alert(err)
//     })
//   }
// })

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

function MarkdownRenderer() {
  const msg = useObservable(() => msg$)
  const markdown = useMemo(() => {
    const { result } = processor.processSync(msg?.markdown)
    //@ts-ignore
    return result.props.children
  }, [msg])
  const [style, setStyle] = useState<string>()
  useEffect(() => {
    const subscription = plugin$.subscribe((plugin) => {
      const fetchPlugin = async () => {
        const style = await cssLoader.fetchStyle(plugin)
        setStyle(style)
      }

      fetchPlugin()
    })
    return () => subscription.unsubscribe()
  }, [])
  return (
    <>
      <style>{style ?? ''}</style>
      <div id="markdown-renderer" className="markdown markdown-body">
        {markdown}
      </div>
    </>
  )
}

function Home() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    sendReadySignal()
  }, [])

  useEffect(() => {
    if (ref.current) {
      const el = ref.current
      const shadow = el.attachShadow({ mode: 'open' })
      const root = document.createElement('div')
      shadow.appendChild(root)
      ReactDOM.render(<MarkdownRenderer />, root)
    }
  }, [ref])

  return (
    <div
      id="renderer-slot"
      ref={ref}
      css={`
        padding: 24px 16px;
      `}></div>
  )
}

export default Home
