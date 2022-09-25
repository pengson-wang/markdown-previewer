import { useState, useCallback, useMemo } from 'react'
import { map } from 'rxjs/operators'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { useObservable } from 'rxjs-hooks'
import md5 from 'md5'
import AddPluginModal from './add'
import Plugin from './plugin'
import { pluginsObservable, PluginProps, selectedPluginObservable, createPlugin, enablePlugin } from 'states/preferences'

function anyDateToNumber(date: any) {
  const d = new Date(date)
  return d.valueOf()
}

const pluginsAsList$ = pluginsObservable.pipe(
  map((plugins) => Object.values(plugins).sort((a, b) => anyDateToNumber(a.createdAt) - anyDateToNumber(b.createdAt)))
)

function Add() {
  const [show, setShow] = useState(false)
  const onHide = useCallback(() => setShow(false), [])
  const onOk = useCallback(
    ({ name, url, cover, highlight, selected }: Pick<PluginProps, 'name' | 'url' | 'cover' | 'highlight'> & { selected: boolean }) => {
      const id = createPlugin({ name, url, cover, highlight })
      if (selected) {
        enablePlugin(id)
      }
      setShow(false)
    },
    []
  )
  return (
    <>
      <Button onClick={() => setShow(true)} variant="primary">
        Add
      </Button>
      <AddPluginModal show={show} onHide={onHide} onOk={onOk} />
    </>
  )
}

export function Plugins() {
  const plugins = useObservable(() => pluginsAsList$, [] as PluginProps[])

  return (
    <div>
      <Add />
      <div
        css={`
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 24px 0;
          [name='themes'] {
            &:nth-of-type(n + 1) {
              margin-right: 8px;
            }
          }
        `}>
        {plugins.map((plugin) => (
          <Plugin key={plugin.id} plugin={plugin} />
        ))}
      </div>
    </div>
  )
}

export function App() {
  return (
    <div>
      <Plugins />
      <hr />
      <p>
        <a rel="noreferrer" href="https://github.com/pengson-wang/markdown-previewer#theme" target="_blank">
          What is Theme ?
        </a>
      </p>
    </div>
  )
}

export default App
