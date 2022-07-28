import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export function PluginDeleteConfirm({ pluginName, onHide, onOk }: { pluginName: string; onHide: () => void; onOk: () => void }) {
  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          Delete plugin <strong>{pluginName}</strong> ?
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
