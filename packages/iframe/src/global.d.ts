import { CSSProp } from 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    // Your theme stuff here
  }
}

declare module 'react' {
  interface Attributes {
    name?: string
    css?: CSSProp
    id?: string
    markdown?: string
    width?: number
    height?: number
    alt?: string
    src?: string
  }
}
