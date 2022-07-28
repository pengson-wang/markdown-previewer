import React, { useMemo, useState, useRef, forwardRef } from 'react'
import Badge from 'react-bootstrap/Badge'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useObservable } from 'rxjs-hooks'
import TrashIcon from 'components/icons/trash-icon'
import { Square as SquareIcon, CheckSquare as CheckSquareIcon } from 'components/icons/square-icon'
import { PluginProps, selectedPluginObservable, removePlugin, enablePlugin } from 'states/preferences'

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
      {enabled ? 'unselect' : 'select as the default renderer'}
    </Tooltip>
  )
  return (
    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
      <IconButton
        ref={target}
        icon={enabled ? <CheckSquareIcon color="#3498db" size={16} /> : <SquareIcon color="grey" size={16} />}
        onClick={() => enablePlugin(id)}
      />
    </OverlayTrigger>
  )
}

function Plugin({ plugin }: { plugin: PluginProps }) {
  const selected = useObservable(() => selectedPluginObservable, null)
  const isSelected = useMemo(() => plugin.id === selected, [plugin, selected])
  return (
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
          <EnableBtn id={plugin.id} enabled={isSelected} />
          {!plugin.builtin ? <IconButton icon={<TrashIcon color="#c0392b" size={16} />} onClick={() => removePlugin(plugin.id)} /> : null}
        </div>
      </div>
    </div>
  )
}

export default Plugin
