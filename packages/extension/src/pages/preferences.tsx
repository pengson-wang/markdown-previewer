import { useState, useCallback, useMemo } from 'react'
import { map } from 'rxjs/operators'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { useObservable } from 'rxjs-hooks'
import md5 from 'md5'
import { plugins$, PluginProps, selectedPlugin$ } from 'states/preferences'

function TimeLabel({ timestamp }: { timestamp: any }) {
  const date = useMemo(() => new Date(timestamp), [timestamp])
  return <>{date.toLocaleString()}</>
}

const Edit = ({ size = 24, color = '#f5f5f5' }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
  </svg>
)

const Trash = ({ size = 24, color = '#f5f5f5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
)

function IconBtn({ icon, ...rest }: { icon: any; [p: string]: any }) {
  return (
    <button
      css={`
        outline: none;
        border: none;
        background-color: transparent;
      `}
      {...rest}>
      {icon}
    </button>
  )
}

function Plugin({
  id,
  name,
  createdAt,
  updatedAt,
  handleEdit,
  handleDelete,
}: PluginProps & {
  handleEdit: () => void
  handleDelete: () => void
}) {
  const selected = useObservable(() => selectedPlugin$, null)
  const handleClick = useCallback(
    (e) => {
      selectedPlugin$.next(id)
    },
    [id]
  )
  return (
    <Card
      css={`
        background-color: ${selected === id ? '#f5f5f5' : '#fff'};
        width: 200px;
      `}
      onClick={handleClick}>
      <Card.Body>
        <Card.Title>
          {name}
          <IconBtn
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              handleEdit()
            }}
            icon={<Edit color="#1abc9c" />}
          />
          <IconBtn
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              handleDelete()
            }}
            icon={<Trash color="#c0392b" />}
          />
        </Card.Title>
        <Card.Text>
          {typeof updatedAt !== 'undefined' ? (
            <span>
              updated at <TimeLabel timestamp={updatedAt} />
            </span>
          ) : (
            <span>
              created at <TimeLabel timestamp={createdAt} />
            </span>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export function PluginEditor({
  plugin,
  handleClose,
  handleOk,
}: {
  plugin: PluginProps
  handleClose: () => void
  handleOk: (name: string, url: string) => void
}) {
  const [name, setName] = useState(plugin.name)
  const [url, setUrl] = useState(plugin.url)

  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
          <Form.Control
            placeholder="Input a meaningful name"
            aria-label="plugin-name"
            aria-describedby="name of this plugin"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>URL</InputGroup.Text>
          <Form.Control as="textarea" aria-label="plugin-url" name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleOk(name, url)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function PluginDeleteConfirm({
  plugin,
  handleClose,
  handleOk,
}: {
  plugin: PluginProps
  handleClose: () => void
  handleOk: () => void
}) {
  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Delete plugin <strong>{plugin.name}</strong> ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Later
        </Button>
        <Button variant="danger" onClick={handleOk}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function anyDateToNumber(date: any) {
  const d = new Date(date)
  return d.valueOf()
}

const pluginsAsList$ = plugins$.pipe(
  map((plugins) => Object.values(plugins).sort((a, b) => anyDateToNumber(a.createdAt) - anyDateToNumber(b.createdAt)))
)

export function Plugins() {
  const plugins = useObservable(() => pluginsAsList$, [] as PluginProps[])
  const [show, setShow] = useState<boolean>(false)
  const handleCreate = useCallback(() => setShow(true), [])
  const handleClose = useCallback(() => setShow(false), [])
  const [plugin, setPlugin] = useState<Partial<PluginProps>>({ name: '', url: '' })
  const handleOk = useCallback(() => {
    if (!(plugin.name && plugin.url)) {
      return
    }
    const p = { ...plugin, id: md5(plugin.url), createdAt: Date.now() } as PluginProps
    if (plugin) {
      plugins$.next({ ...plugins$.value, [p.id]: p })
    }
    setPlugin({ name: '', url: '' })
    setShow(false)
  }, [plugin])

  const [pluginInEdit, setPluginInEdit] = useState<PluginProps | null>()

  const [pluginInDelete, setPluginInDelete] = useState<PluginProps | null>()
  const handleDelete = useCallback((plugin: PluginProps) => {
    delete plugins$.value[plugin.id]
    plugins$.next(plugins$.value)
  }, [])

  return (
    <div>
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create you own plugin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
              <Form.Control
                placeholder="Input a meaningful name"
                aria-label="plugin-name"
                aria-describedby="name of this plugin"
                name="name"
                value={plugin?.name}
                onChange={(e) => setPlugin((p) => ({ ...p, name: e.target.value }))}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>URL</InputGroup.Text>
              <Form.Control
                as="textarea"
                aria-label="plugin-url"
                name="url"
                value={plugin?.url}
                onChange={(e) => setPlugin((p) => ({ ...p, url: e.target.value }))}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleOk}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <Button onClick={handleCreate}>Create</Button>
      </div>
      {pluginInEdit && pluginInEdit.id}
      {pluginInEdit ? (
        <PluginEditor
          handleClose={() => {
            setPluginInEdit(null)
          }}
          handleOk={(name, url) => {
            if (pluginInEdit) {
              pluginInEdit.name = name
              pluginInEdit.url = url
              pluginInEdit.updatedAt = Date.now()
              plugins$.next({ ...plugins$.value, [pluginInEdit.id]: pluginInEdit })
            }
            setPluginInEdit(null)
          }}
          plugin={pluginInEdit}
        />
      ) : null}
      {pluginInDelete ? (
        <PluginDeleteConfirm
          plugin={pluginInDelete}
          handleClose={() => setPluginInDelete(null)}
          handleOk={() => {
            handleDelete(pluginInDelete)
            setPluginInDelete(null)
          }}
        />
      ) : null}
      <div>
        {plugins.map((plugin) => (
          <Plugin key={plugin.id} {...plugin} handleEdit={() => setPluginInEdit(plugin)} handleDelete={() => setPluginInDelete(plugin)} />
        ))}
      </div>
    </div>
  )
}

export function App() {
  return (
    <div>
      <h1>Plugin Manager</h1>
      <Plugins />
    </div>
  )
}

export default App
