import { forwardRef } from 'react'

const IconButton = forwardRef(
  (
    {
      type,
      icon,
      width = 32,
      height = 24,
      ...rest
    }: {
      type?: 'button' | 'submit' | 'reset'
      width?: number
      height?: number
      icon: React.ReactNode
      onClick?: React.MouseEventHandler<HTMLButtonElement>
      onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
      onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
    },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        type={type ?? 'button'}
        ref={ref}
        {...rest}
        css={`
          width: ${width}px;
          height: ${height}px;
          background-color: transparent;
          outline: none;
          border: none;
        `}>
        {icon}
      </button>
    )
  }
)

export default IconButton
