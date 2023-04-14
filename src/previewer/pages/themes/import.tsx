import React, { useCallback, useState, useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import * as yup from 'yup'
import Modal from 'react-bootstrap/Modal'
import { PluginProps } from 'previewer/states/preferences'

const themesSchema = yup.array().of(
  yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
    url: yup.string().url().required(),
    highlight: yup.string(),
    cover: yup.string(),
    builtin: yup.bool(),
  })
)

interface Props {
  show: boolean
  onHide: () => void
  onOk: (theme: PluginProps[]) => void
}

function Import({ show, onHide, onOk }: Props) {
  const [isValid, setIsValid] = useState<boolean>()
  const [themes, setThemes] = useState<PluginProps[]>()
  const isInValid = useMemo(() => {
    if (typeof isValid === 'undefined') {
      return undefined
    }
    return !isValid
  }, [isValid])
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = (evt: any) => {
        try {
          const json = JSON.parse(evt.target.result)
          themesSchema.validateSync(json)
          setIsValid(true)
          setThemes(json as PluginProps[])
        } catch (err) {
          setIsValid(false)
        }
      }
    }
  }, [])
  const handleOk = useCallback(() => {
    themes && onOk(themes)
  }, [themes, onOk])
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Import</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFileSm" className="mb-3">
          <Form.Label>Small file input example</Form.Label>
          <Form.Control type="file" size="sm" isValid={isValid} isInvalid={isInValid} onChange={handleChange} accept="application/json" />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Later
        </Button>
        <Button variant="primary" onClick={handleOk} disabled={isInValid}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Import
