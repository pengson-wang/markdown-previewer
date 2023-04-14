/**
 * Send msg to parent(content-script)
 */
import { Subscription } from 'rxjs'
import { Msg, makeMsg } from 'types'
import { preferences$ } from './preferences'

export function send<T>(msg: Msg.Msg<T>) {
  window.parent.postMessage(msg, '*')
}

export function sendReadySignal() {
  console.log('send appready signal')
  send(makeMsg([Msg.From.Iframe, Msg.Category.IframeReady], true))
}

export function sendPreferences(info: any) {
  console.log('send preferences', info)
  send(makeMsg([Msg.From.Iframe, Msg.Category.Preferences], info))
}

let subscription: Subscription

export function activeSyncPreferences() {
  subscription = preferences$.subscribe((p) => {
    sendPreferences(p)
  })
}

export function deactiveSyncPreferences() {
  if (subscription) {
    subscription.unsubscribe()
  }
}
