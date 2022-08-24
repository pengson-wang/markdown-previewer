import ReactDOM from 'react-dom'
import { useEffect, useRef, useState, useMemo } from 'react'
import { combineLatest } from 'rxjs'
import { distinctUntilChanged, map, filter, shareReplay } from 'rxjs/operators'
import { sendReadySignal } from 'states/general'
import markdown$ from 'states/markdown'
import { useObservable } from 'rxjs-hooks'
import 'highlight.js/styles/github.css'
import Dropdown from 'react-bootstrap/Dropdown'
import { pluginsObservable, PluginProps, selectedPluginObservable, enablePlugin } from 'states/preferences'

enum LoadState {
  Loading,
  Loaded,
  Failed,
}

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
      const resp = await fetch(this.tidyURL(plugin.url))
      const text = await resp.text()
      return text
    } catch (err) {
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
  })
)

function MarkdownRenderer() {
  const markdown = useObservable(() => markdown$)
  const [style, setStyle] = useState<string>()
  useEffect(() => {
    const subscription = plugin$.subscribe((plugin) => {
      const fetchPlugin = async () => {
        if (plugin) {
          const style = await cssLoader.fetchStyle(plugin)
          setStyle(style)
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
      <style>{style ?? ''}</style>
      <div id="markdown-renderer" className="markdown markdown-body" style={{ padding: `16px 32px` }}>
        {markdown}
      </div>
    </>
  )
}

function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const selectedPlugin = useObservable(() => plugin$)
  const allPlugins = useObservable(() => pluginsObservable)
  const allPluginsAsList = useMemo(() => Array.from(Object.values(allPlugins ?? {})), [allPlugins])
  const plugins = useMemo(() => allPluginsAsList.filter((p) => p.id !== selectedPlugin?.id), [allPluginsAsList, selectedPlugin])
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
    <div>
      <div
        id="renderer-slot"
        ref={ref}
        css={`
          padding: 24px 16px;
        `}></div>

      <div
        css={`
          position: fixed;
          bottom: 0;
          padding: 0 8px;
          background-color: #1a2a3a;
          color: #fff;
          width: 100%;
          height: 30px;
        `}>
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
              {selectedPlugin?.name}
            </Dropdown.Toggle>

            {plugins.length ? (
              <Dropdown.Menu variant="dark">
                {plugins.map((p) => (
                  <Dropdown.Item menuVariant="dark" key={p.id} onClick={() => enablePlugin(p.id)}>
                    {p.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            ) : null}
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default Home
