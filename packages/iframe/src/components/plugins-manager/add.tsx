import { useFormik } from 'formik'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { TwitterPicker, ColorChangeHandler, ColorResult } from 'react-color'
import * as yup from 'yup'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import EditIcon from 'components/icons/edit-icon'
import { PluginProps } from 'states/preferences'
import IconButton from 'components/icon-button'
import CheckIcon from 'components/icons/check-icon'
import highlightThemes from 'constants/highlight-theme.json'

function usePrevious(value: unknown) {
  const ref = useRef<unknown>()
  useEffect(() => {
    ref.current = value //assign the value of ref to the argument
  }, [value]) //this code will run when the value of 'value' changes
  return ref.current //in the end, return the current ref value.
}

function useChanged(value: unknown) {
  const previous = usePrevious(value)
  const [changed, setChanged] = useState<boolean>(false)
  useEffect(() => {
    if (value !== previous) {
      setChanged(true)
    }
  }, [value, previous])
  return changed
}

type Value = Pick<PluginProps, 'name' | 'url' | 'cover' | 'highlight'> & { selected: boolean }

interface Props {
  show: boolean
  onHide: () => void
  onOk: (v: Value) => void
}

export default function Add({ show, onHide, onOk }: Props) {
  const { values, errors, dirty, isValid, handleSubmit, handleChange, setFieldValue, resetForm } = useFormik<Value>({
    initialValues: {
      name: '',
      url: '',
      selected: false,
      highlight: 'github',
      cover: '#c27c88',
    },
    validationSchema: yup.object({
      url: yup.string().url().required(),
    }),
    onSubmit: (values) => {
      onOk(values)
      resetForm()
    },
  })
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
  const handleColorChange = useCallback<ColorChangeHandler>(
    (color: ColorResult, e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('cover', color.hex)
    },
    [setFieldValue]
  )

  const [editName, setEditName] = useState<boolean>(false)

  const handleHide = useCallback(() => {
    resetForm()
    onHide()
  }, [onHide, resetForm])

  return (
    <Modal
      show={show}
      onHide={handleHide}
      onClick={(e: React.MouseEvent) => {
        setShowColorPicker(false)
      }}>
      {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify({ values, errors }, null, 2)}</pre>}
      <div
        css={`
          background-color: ${values.cover ?? '#000'};
          width: 100%;
          height: 134px;
          position: relative;
        `}>
        <h1
          css={`
            text-align: center;
            color: #fff;
            font-size: 24px;
            line-height: 134px;
          `}>
          Choose a Cover
        </h1>
        <CloseButton
          variant="white"
          onClick={handleHide}
          css={`
            position: absolute;
            right: 4px;
            top: 4px;
          `}
        />
        <IconButton
          width={24}
          height={24}
          css={`
            position: absolute;
            right: 2px;
            bottom: 4px;
          `}
          onClick={(e) => {
            e.stopPropagation()
            setShowColorPicker(true)
          }}
          icon={<EditIcon color="#fff" size={16} />}
        />
      </div>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div
            name="color-picker-container"
            css={`
              position: absolute;
              display: ${showColorPicker ? 'initial' : 'none'};
              z-index: 999;
            `}
            onClick={(e) => {
              e.stopPropagation()
            }}>
            <TwitterPicker onChangeComplete={handleColorChange} colors={['#60281E', '#c27c88', '#FF7500', '#41555D']} />
          </div>
          <Form.Group className="mb-3">
            <Form.Control
              rows={3}
              placeholder="Paste the url of the theme css, e.g. https://github.com/pengson-wang/markdown-css-themes/blob/main/themes/github.css"
              as="textarea"
              aria-label="theme-css-url"
              name="url"
              size="sm"
              value={values.url}
              isInvalid={!!errors.url}
              onChange={(e) => {
                e.persist()
                handleChange(e)
                if (!values.name) {
                  const url = e.target.value
                  const name = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.css'))
                  setFieldValue('name', name)
                }
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.url}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Select name="highlight" aria-label="Default select example" onChange={handleChange}>
              {highlightThemes.map((h) => (
                <option value={h.path}>{h.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group
            className="mb-3"
            css={`
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
            `}>
            {dirty && !errors.url ? (
              <>
                <Form.Check type="checkbox" label="enabled" name="selected" onChange={handleChange} />
                {editName ? (
                  <>
                    <Form.Control
                      placeholder={values.name}
                      aria-label="theme-name"
                      aria-describedby="name of this theme"
                      name="name"
                      size="sm"
                      value={values.name}
                      onChange={handleChange}
                    />
                    <IconButton
                      width={24}
                      height={24}
                      onClick={(e) => {
                        setEditName(false)
                      }}
                      icon={<CheckIcon color="#c27c88" size={16} />}
                    />
                  </>
                ) : (
                  <p>
                    {values.name}
                    <IconButton
                      width={24}
                      height={24}
                      onClick={(e) => {
                        setEditName(true)
                      }}
                      icon={<EditIcon color="#c27c88" size={16} />}
                    />
                  </p>
                )}
              </>
            ) : null}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide}>
            Later
          </Button>
          <Button type="submit" variant="primary" disabled={!isValid}>
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
