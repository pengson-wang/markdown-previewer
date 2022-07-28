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
import { pluginsObservable, PluginProps, selectedPluginObservable, createPlugin } from 'states/preferences'

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
  const onOk = useCallback(({ name, url, cover }: Pick<PluginProps, 'name' | 'url' | 'cover'>) => {
    createPlugin({ name, url, cover })
    setShow(false)
  }, [])
  return (
    <>
      <Button onClick={() => setShow(true)}>Add</Button>
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
          padding: 24px 0;
          [name='plugin'] {
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
        <a rel="noreferrer" href="https://github.com/pengson-wang/markdown-previewer#plugin" target="_blank">
          What is plugin ?
        </a>
        {'  '}
        <a rel="noreferrer" href="https://github.com/pengson-wang/markdown-previewer#how-to-make-your-own-plugin" target="_blank">
          Make your own.
        </a>
      </p>
    </div>
  )
}

export default App
