import * as ReactDOM from 'react-dom/client'
import { useEffect, useRef, useMemo } from 'react'
import { sendReadySignal } from 'previewer/states/general'
import { useObservable } from 'rxjs-hooks'
import Dropdown from 'react-bootstrap/Dropdown'
import Sidebar from 'previewer/components/sidebar'
import { pluginsObservable, enablePlugin } from 'previewer/states/preferences'
import MarkdownRenderer, { plugin$ } from 'previewer/components/markdown'
import { motion } from 'framer-motion'

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
      const dom = document.createElement('div')
      shadow.appendChild(dom)
      const root = ReactDOM.createRoot(dom)
      root.render(<MarkdownRenderer />)
    }
  }, [ref])

  return (
    <motion.section
      name="home"
      css={`
        padding-right: 32px;
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1, transition: { duration: 0 } }}
      transition={{ duration: 0.3 }}>
      <Sidebar />
      <div id="renderer-slot" ref={ref}></div>

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
    </motion.section>
  )
}

export default Home
