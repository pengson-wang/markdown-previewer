import { Msg } from 'shared/msg'
import { ReplaySubject } from 'rxjs'
import { makeInputChangeMsg, makePathMsg, MessageHandler } from './mq'
import previewer from './previewer'

//const htmlURL = `http://localhost:3000`
const htmlURL = chrome.runtime.getURL('iframe.html')
const iframe = document.createElement('iframe')
iframe.id = 'previewer'
iframe.src = htmlURL
iframe.style.visibility = 'hidden'
document.body.parentElement?.appendChild(iframe)

const mq$ = new ReplaySubject<Msg.Msg<any>>(10)
const messageHandler = new MessageHandler(mq$, (msg) => iframe?.contentWindow?.postMessage(msg, '*'))

mq$.next(makePathMsg(location.href))

iframe.onload = function () {
  console.info('Previewer Frame Loaded. Try loading Previewer ...')
}

const textarea = {
  get current() {
    return this._textarea
  },
  set current(value) {
    if (value && value !== this._textarea) {
      this._textarea = value
      for (let eventName of this._listeners.keys()) {
        const myOldListener = this._myListeners.get(eventName)
        if (myOldListener) {
          this._textarea.removeEventListener(eventName, myOldListener)
        }
      }

      ;['click', 'change', 'keyup', 'keypress', 'keydown'].forEach((eventName) => {
        let listeners = this._listeners.get(eventName)
        if (!listeners) {
          listeners = []
          this._listeners.set(eventName, listeners)
        }
        const myListener = (e: Event) => {
          listeners?.forEach((l) => l(e))
        }
        this._myListeners.set(eventName, myListener)
        this._textarea.addEventListener(eventName, myListener)
      })
    }
  },
  addEventListener<K extends keyof HTMLElementEventMap>(eventName: K, listener: EventListener) {
    const listeners = this._listeners.get(eventName)
    if (!listeners) {
      this._listeners.set(eventName, [listener])
    } else {
      listeners.push(listener)
    }
  },
  removeEventListener<K extends keyof HTMLElementEventMap>(eventName: K, listener: EventListener) {
    const listeners = this._listeners.get(eventName)
    if (listeners && listeners.indexOf(listener) > -1) {
      listeners.splice(listeners.indexOf(listener), 1)
    }
  },
  _textarea: HTMLTextAreaElement.prototype,
  _myListeners: new Map<string, EventListener>(),
  _listeners: new Map<string, Array<EventListener>>(),
}

function handleInputChange(input: string) {
  messageHandler.push(makeInputChangeMsg(input))
}

// keep deteck the first textarea until detected. If the right textarea is not the first one in the document, this might leads to a problem.
function findTextarea() {
  const win = window.parent || window
  const target = win.document.querySelector('textarea')
  if (target && target !== textarea.current) {
    textarea.current = target
    handleInputChange(textarea.current.value)
    return
  }
  window.requestAnimationFrame(findTextarea)
}
window.requestAnimationFrame(findTextarea)

textarea.addEventListener('change', (e) => {
  handleInputChange((e?.target as HTMLTextAreaElement).value as string)
})
textarea.addEventListener('keypress', (e) => {
  handleInputChange((e?.target as HTMLTextAreaElement).value as string)
})

window.addEventListener('message', function (event) {
  if (event.data) {
    const { id, type, content } = event.data as Msg.Msg<any>
    if (id && type.length) {
      switch (type[1]) {
        // Start the message handler (which will start pushing messages to the inframe) only when the iframe(actualy the app in the inframe) is loaded
        case Msg.Category.IframeReady:
          if (content as boolean) {
            messageHandler.start()
            // enable previewer by default
            previewer.enable()
          }
          return
        default:
          return
      }
    } else {
      console.info(`Unknow message type ${type}`)
    }
  }
})

previewer.enabled.subscribe((value) => {
  if (value) {
    iframe.style.visibility = 'visible'
    document.body.classList.add('previewer-loaded')
    chrome.runtime.sendMessage({ type: 'enabled' })
  } else {
    iframe.style.visibility = 'hidden'
    document.body.classList.remove('previewer-loaded')
    chrome.runtime.sendMessage({ type: 'disabled' })
  }
})

// chrome.runtime.onMessage.addListener(function (request, _ /*sender*/, sendResponse) {
//   console.log(`got resquest type=${request.type}`)
//   sendResponse({
//     received: true,
//   })
//   if (request.type === 'switch') {
//     previewer.onSwitch()
//   } else {
//     console.log(`unknown request type [${request.type}]`)
//   }
// })

chrome.runtime.onMessage.addListener(function (request, _ /*sender*/, sendResponse) {
  console.log(`got resquest type=${request.type}`)
  if (request.type === 'switch') {
    sendResponse({
      received: true,
    })
    previewer.switch()
    chrome.runtime.sendMessage({ type: previewer.isEnabled() ? 'enabled' : 'disabled' })
  }
})

/* Send 'enable' command to background, background will then send 'enabled' signal back.
 * After it is received, client will then send 'active' command to background, it then set 'on' tag on the icon of extension,
 */
// chrome.runtime.sendMessage({ type: 'enable' }, function (response) {
//   console.log(response)
// })
