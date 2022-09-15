import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function PluginDeleteConfirm({
  show,
  name,
  onHide,
  onOk,
}: {
  show: boolean
  name: string
  onHide: () => void
  onOk: () => void
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          Are you absolutely sure to delete <strong>{name}</strong> ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Later
        </Button>
        <Button variant="danger" onClick={onOk}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
