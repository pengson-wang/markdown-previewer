import { useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import { TwitterPicker, ColorChangeHandler, ColorResult } from 'react-color'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import EditIcon from 'components/icons/edit-icon'
import { PluginProps } from 'states/preferences'
import InputGroup from 'react-bootstrap/InputGroup'
import IconButton from 'components/icon-button'

type Value = Pick<PluginProps, 'name' | 'url' | 'cover'>

interface Props {
  show: boolean
  onHide: () => void
  onOk: (v: Value) => void
}

export default function Add({ show, onHide, onOk }: Props) {
  const { values, handleSubmit, handleChange, setFieldValue } = useFormik<Value>({
    initialValues: {
      name: '',
      url: '',
      cover: '#000',
    },
    onSubmit: (values) => {
      onOk(values)
    },
  })
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
  const handleColorChange = useCallback<ColorChangeHandler>(
    (color: ColorResult, e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('cover', color.hex)
      setShowColorPicker(false)
    },
    [setFieldValue]
  )
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create you own plugin</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div
            css={`
              background-color: ${values.cover ?? '#000'};
              width: 100%;
              height: 68px;
              position: relative;
            `}>
            <IconButton
              width={24}
              height={24}
              css={`
                position: absolute;
                right: 2px;
                bottom: 4px;
              `}
              onClick={() => setShowColorPicker(true)}
              icon={<EditIcon color="#fff" size={16} />}
            />
          </div>
          <div
            css={`
              position: absolute;
              display: ${showColorPicker ? 'initial' : 'none'};
              z-index: 999;
            `}>
            <TwitterPicker onChangeComplete={handleColorChange} />
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
            <Form.Control
              placeholder="Input a meaningful name"
              aria-label="plugin-name"
              aria-describedby="name of this plugin"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>URL</InputGroup.Text>
            <Form.Control as="textarea" aria-label="plugin-url" name="url" value={values.url} onChange={handleChange} />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
