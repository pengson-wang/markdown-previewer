import React, { useMemo, useState, useRef, forwardRef } from 'react'
import Badge from 'react-bootstrap/Badge'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useObservable } from 'rxjs-hooks'
import TrashIcon from 'components/icons/trash-icon'
import { Square as SquareIcon, CheckSquare as CheckSquareIcon } from 'components/icons/square-icon'
import { PluginProps, selectedPluginObservable, removePlugin, enablePlugin } from 'states/preferences'
import DeleteConfirm from './delete-confirm'

function TimeLabel({ timestamp }: { timestamp: any }) {
  const date = useMemo(() => new Date(timestamp), [timestamp])
  return <>{`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`}</>
}

const IconButton = forwardRef(
  (
    {
      icon,
      ...rest
    }: {
      icon: React.ReactNode
      onClick?: React.MouseEventHandler<HTMLButtonElement>
      onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
      onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
    },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        {...rest}
        css={`
          width: 32px;
          height: 24px;
          background-color: transparent;
          outline: none;
          border: none;
        `}>
        {icon}
      </button>
    )
  }
)

function EnableBtn({ id, enabled }: { id: string; enabled?: boolean }) {
  const target = useRef<HTMLButtonElement>(null)
  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {enabled ? 'Un-use this theme' : 'Use this theme'}
    </Tooltip>
  )
  return (
    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
      <IconButton
        ref={target}
        icon={enabled ? <CheckSquareIcon color="#3498db" size={16} /> : <SquareIcon color="grey" size={16} />}
        onClick={() => enablePlugin(enabled ? undefined : id)}
      />
    </OverlayTrigger>
  )
}

function Plugin({ plugin }: { plugin: PluginProps }) {
  const selected = useObservable(() => selectedPluginObservable, null)
  const isSelected = useMemo(() => plugin.id === selected, [plugin, selected])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  return (
    <>
      <DeleteConfirm
        show={showDeleteConfirm}
        name={plugin.name}
        onHide={() => setShowDeleteConfirm(false)}
        onOk={() => removePlugin(plugin.id)}
      />
      <div
        name="plugin"
        css={`
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
          width: ${140 * 1.618}px;
          height: 160px;
        `}>
        <div
          css={`
            background-color: ${plugin.cover};
            color: #fff;
            padding: 8px;
            text-align: center;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}>
          <h2>{plugin.name}</h2>
        </div>
        <div
          css={`
            display: flex;
            justify-content: space-between;
            padding: 8px 4px;
          `}>
          <div>{plugin.builtin ? <Badge bg="dark">Builtin</Badge> : null}</div>
          <div>
            {!plugin.builtin ? (
              <IconButton icon={<TrashIcon color="#c0392b" size={16} />} onClick={() => setShowDeleteConfirm(true)} />
            ) : null}
            <EnableBtn id={plugin.id} enabled={isSelected} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Plugin
