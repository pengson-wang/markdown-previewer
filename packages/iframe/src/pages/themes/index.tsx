import { useState, useCallback } from 'react'
import { map } from 'rxjs/operators'
import Button from 'react-bootstrap/Button'
import { useObservable } from 'rxjs-hooks'
import AddPluginModal from './add'
import Plugin from './plugin'
import { pluginsObservable, PluginProps, createPlugin, enablePlugin } from 'states/preferences'
import { Routes, Route, Link } from 'react-router-dom'
import Details from './details'
import { motion } from 'framer-motion'
import ArrowLeftIcon from 'components/icons/arrow-left-icon'

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
        <Add />
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
