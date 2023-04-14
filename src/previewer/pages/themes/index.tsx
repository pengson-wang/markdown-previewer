import { useState, useCallback } from 'react'
import { map } from 'rxjs/operators'
import Button from 'react-bootstrap/Button'
import { useObservable } from 'rxjs-hooks'
import AddPluginModal from './add'
import ImportModal from './import'
import Plugin from './plugin'
import { pluginsObservable, PluginProps, createPlugin, enablePlugin, importPlugins } from 'previewer/states/preferences'
import { Routes, Route, Link } from 'react-router-dom'
import Details from './details'
import { motion } from 'framer-motion'
import ArrowLeftIcon from 'previewer/components/icons/arrow-left-icon'

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
      <div
        css={`
          float: right;
        `}>
        <Button onClick={() => setShow(true)} variant="primary" size="sm">
          Add
        </Button>
      </div>
      <AddPluginModal show={show} onHide={onHide} onOk={onOk} />
    </>
  )
}

function Export() {
  const themes = useObservable(() => pluginsAsList$, [] as PluginProps[])
  const onExport = useCallback(() => {
    const a = document.createElement('a')
    a.style.display = 'block'
    const file = new Blob([JSON.stringify(themes, null, 2)], { type: 'application/json' })
    a.href = URL.createObjectURL(file)
    a.download = 'themes.json'
    document.body.appendChild(a)
    a.click()
  }, [themes])

  return (
    <>
      <Button variant="secondary" size="sm" onClick={onExport}>
        Export
      </Button>
    </>
  )
}

function Import() {
  const [show, setShow] = useState<boolean>(false)
  const onHide = useCallback(() => setShow(false), [])
  const onOk = useCallback((themes: PluginProps[]) => {
    importPlugins(
      themes.reduce((a, c) => {
        a[c.id] = c
        return a
      }, {} as Record<string, PluginProps>),
      { replaceExists: true }
    )
    setShow(false)
  }, [])
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setShow(true)}>
        Import
      </Button>
      <ImportModal show={show} onHide={onHide} onOk={onOk} />
    </>
  )
}

export function Themes() {
  const plugins = useObservable(() => pluginsAsList$, [] as PluginProps[])

  return (
    <motion.div
      id="themes-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      transition={{ duration: 0.3 }}>
      <div
        name="actions"
        css={`
          padding: 8px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:after {
            content: '.';
            height: 0;
            display: block;
            clear: both;
          }
        `}>
        <h1
          css={`
            display: flex;
            align-items: center;
          `}>
          <Link
            to="/"
            css={`
              display: flex;
              align-items: center;
              margin-left: -8px;
              width: 36px;
              height: 36px;
              &:hover {
                outline: 1px dashed #aaaaaa;
              }
            `}>
            <ArrowLeftIcon size={24} color="blue" />
          </Link>
          <span
            css={`
              font-size: 18px;
            `}>
            Markdown Themes
          </span>
        </h1>
        <div
          css={`
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;
            gap: 8px;
          `}>
          <Add />
          <Import />
          <Export />
        </div>
      </div>

      <div
        id="themes"
        css={`
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 24px 0;
        `}>
        {plugins.map((plugin) => (
          <Plugin key={plugin.id} plugin={plugin} />
        ))}
      </div>
      <p>
        <a rel="noreferrer" href="https://github.com/pengson-wang/markdown-previewer#theme" target="_blank">
          What is Theme ?
        </a>
      </p>
    </motion.div>
  )
}

export function ThemesContainer() {
  return (
    <div
      css={`
        padding: 8px 16px;
        min-height: 100vh;
      `}>
      <Routes>
        <Route path="" element={<Themes />} />
        <Route path="/:id" element={<Details />} />
      </Routes>
    </div>
  )
}

export default ThemesContainer
