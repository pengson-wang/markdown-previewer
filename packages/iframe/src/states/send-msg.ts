/**
 * Send msg to parent(content-script)
 */

import { Msg, makeMsg } from 'shared'
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

preferences$.subscribe((p) => {
  sendPreferences(p)
})
