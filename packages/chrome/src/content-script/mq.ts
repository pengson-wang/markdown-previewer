import { Msg } from 'shared'
import { Subject, Subscription } from 'rxjs'
import { nanoid } from 'nanoid'

export function makeMsg<T>(type: Msg.Type, content: T) {
  return {
    id: nanoid(),
    type: type,
    content: content,
  } as Msg.Msg<T>
}

export function makeInputChangeMsg(input: string) {
  return makeMsg([Msg.From.Content, Msg.Category.InputChange], input)
}

export function makePathMsg(path: string) {
  return makeMsg([Msg.From.Content, Msg.Category.Path], path)
}

export class MessageHandler<T extends Msg.Msg<T>> {
  private source: Subject<T>
  private subscription?: Subscription
  private sender?: (msg: T) => void
  constructor(source: Subject<T>, sender?: (msg: T) => void) {
    this.source = source
    this.sender = sender
  }
  push(msg: T) {
    this.source.next(msg)
  }
  start() {
    this.subscription?.unsubscribe()
    if (!this.sender) {
      console.warn('failed to start the msg sender since the sender is not configured!')
      return
    }
    this.subscription = this.source.subscribe((value) => {
      if (!this.sender) {
        console.warn('Sender of message has not been provided')
        return
      }
      console.log(`Will Send message to previewer:\n`)
      console.log(value)
      this.sender(value)
    })
  }
  destory() {
    this.subscription?.unsubscribe()
  }
  setSender(sender: (msg: T) => void) {
    this.sender = sender
  }
}
