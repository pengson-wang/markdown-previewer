import ReactDOM from 'react-dom'
import { useEffect, useRef, useMemo } from 'react'
import { sendReadySignal } from 'states/general'
import { useObservable } from 'rxjs-hooks'
import Dropdown from 'react-bootstrap/Dropdown'
import { pluginsObservable, enablePlugin } from 'states/preferences'
import MarkdownRenderer, { plugin$ } from 'components/markdown'

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
