import { Msg } from 'shared'
import { ReplaySubject } from 'rxjs'
import { makeInputChangeMsg, makePathMsg, MessageHandler, makeMsg } from './mq'
import previewer from './previewer'
import detectTextArea from './detect-text-area'
import MyStorage from './storage'

// let htmlURL = chrome.runtime.getURL('extension/index.html')
let htmlURL = process.env.RENDER_CONTAINER_URL!
const iframe = document.createElement('iframe')
iframe.id = 'previewer'
iframe.src = htmlURL
iframe.style.visibility = 'hidden'
document.body.parentElement?.appendChild(iframe)
iframe.onload = function () {
  console.info('Previewer frame loaded. \nTry loading Previewer ...')
}

const mq$ = new ReplaySubject<Msg.Msg<any>>(10)
const messageHandler = new MessageHandler(mq$, (msg) => iframe?.contentWindow?.postMessage(msg, '*'))
mq$.next(makePathMsg(location.href))
;(async () => {
  const textarea = await detectTextArea()
  messageHandler.push(makeInputChangeMsg(textarea.value))
  textarea.addEventListener('change', (e) => {
    messageHandler.push(makeInputChangeMsg((e.target as HTMLTextAreaElement).value))
  })
  textarea.addEventListener('keypress', (e: KeyboardEvent) => {
    messageHandler.push(makeInputChangeMsg((e.target as HTMLTextAreaElement).value))
  })

  const keys = {
    preferences: 'preferences',
  }

  const storage = new MyStorage(false)

  const setPreferences = async (preferences: any) => {
    await storage.set(keys.preferences, preferences)
  }

  const getPreferences = async () => {
    return await storage.get(keys.preferences)
  }

  const preferences = await getPreferences()
  messageHandler.push(makeMsg([Msg.From.Content, Msg.Category.Preferences], preferences))

  setInterval(() => {
    ;(async () => {
      const preferences = (await getPreferences()) ?? {}
      console.log(`preferences:\n${JSON.stringify(preferences, null, 2)}`)
    })()
  }, 5000)

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
          case Msg.Category.Preferences:
            if (content) {
              setPreferences(content).catch((err) => console.error(err))
            } else {
              console.warn('Preferences is empty for set')
            }
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
})()
