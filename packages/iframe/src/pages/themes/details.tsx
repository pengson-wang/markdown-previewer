import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { PluginProps } from 'states/preferences'
import { updatePlugin, pluginsObservable } from 'states/preferences'
import EditModal, { Value } from './edit'
import { useObservable } from 'rxjs-hooks'
import { map } from 'rxjs/operators'
import ArrowLeftIcon from 'components/icons/arrow-left-icon'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function Details({ theme }: { theme: PluginProps }) {
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const handleOnSubmit = useCallback(
    (v: Value) => {
      updatePlugin(theme.id, v)
    },
    [theme]
  )

  return (
    <motion.div
      css={`
        min-width: 240px;
        max-width: 350px;
        position: fixed;
        top: 0;
        background-color: #fff;
      `}
      initial={{ x: '100vw', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100vw', opacity: 1, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}>
      <Link
        to=".."
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
      <EditModal show={showEditModal} theme={theme} onOk={handleOnSubmit} onHide={() => setShowEditModal(false)} />
      <div
        name="cover"
        css={`
          background-color: ${theme.cover};
          width: 100%;
          height: 100px;
          position: relative;
        `}>
        <h1
          css={`
            text-align: center;
            line-height: 100px;
            color: #fff;
          `}>
          {theme.name}
        </h1>
      </div>
      <div>{theme.builtin ? <Badge bg="dark">Builtin</Badge> : null}</div>

      <div>
        theme:{' '}
        <a
          href={theme.url}
          target="_blank"
          rel="noreferrer"
          css={`
            word-break: break-all;
          `}>
          {theme.url}
        </a>
      </div>
      <div
        css={`
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          grid-template-rows: repeat(3, 1fr);
        `}>
        <div>
          highlight: <a href={`https://github.com/highlightjs/highlight.js/tree/main/src/styles/${theme.highlight}`}>{theme.highlight}</a>
        </div>
        {theme.updatedAt ? <span>updated at {theme.updatedAt}</span> : <span>created {dayjs(theme.createdAt).toNow()}</span>}
        <div>
          <Button size="sm" onClick={() => setShowEditModal(true)}>
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Protected() {
  const { id } = useParams()
  const theme = useObservable(() => pluginsObservable.pipe(map((all) => (id ? all[id] : null))))

  if (!(id && theme)) {
    return <div>not found</div>
  }

  return <Details theme={theme!} />
}
