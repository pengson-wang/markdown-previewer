import { nanoid } from 'nanoid'

export module Msg {
  export enum From {
    Content,
    Iframe,
    Renderer,
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

export function makeMsg<T>(type: Msg.Type, content: T) {
  return {
    id: nanoid(),
    type: type,
    content: content,
  } as Msg.Msg<T>
}
