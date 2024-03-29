import React, { useState, ReactNode } from 'react'
import IconSettings from './icons/settings-icon'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Offcanvas from 'react-bootstrap/Offcanvas'

function IconButton({ icon, onClick, ...rest }: { icon: ReactNode; onClick: React.MouseEventHandler }) {
  return (
    <button
      css={`
        border: none;
        outline: none;
        background-color: #c27c88;
        &:hover,
        &:active {
          background-color: #ae6f7a;
        }
        position: fixed;
        right: 8px;
        top: 8px;
        width: 32px;
        height: 32px;
        border-radius: 100%;
        display: flex;
        align-items: center;
      `}
      onClick={onClick}
      {...rest}
      type="button">
      {icon}
    </button>
  )
}

export default function Settings({ className }: { className?: string }) {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  return (
    <>
      <IconButton onClick={handleShow} icon={<IconSettings color="#fff" />} />
      <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="static" className={className}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Tabs defaultActiveKey="themes" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="themes" title="Themes">
              <div>preferences</div>
            </Tab>
          </Tabs>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
