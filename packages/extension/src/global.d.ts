/// <reference path="../node_modules/@types/react/index.d.ts"/>
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    name?: string
  }
  interface Attributes {
    css?: CSSProp
    [p?: string]: any
  }
}

declare global {
  namespace JSX {
    // tslint:disable-next-line: no-empty-interface
    interface IntrinsicAttributes extends SxProps {}
  }
}
