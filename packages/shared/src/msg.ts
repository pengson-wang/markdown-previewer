export module Msg {
  export enum From {
    Content,
    Iframe,
  }
  export enum Category {
    CMD,
    InputChange,
    Path,
    General,
    IframeReady,
  }
  export enum Phase {
    Request,
    Response,
  }
  export type Type = [From, Category, Phase?]

  export interface Msg<T> {
    id: string
    type: Type
    content: T
  }
}
