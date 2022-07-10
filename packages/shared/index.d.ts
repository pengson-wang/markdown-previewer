export * from './msg'

export interface InputMsgForRenderer {
  markdown: string
  metadata: {
    owner: string
    repo: string
    branch: string
  }
}

export function makeMsg<T>(type: Msg.Type, content: T): Msg.Msg<T>
