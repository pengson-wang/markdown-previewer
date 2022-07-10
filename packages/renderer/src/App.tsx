import Renderer from 'components/renderer'
import { animationFrames, combineLatest, fromEvent } from 'rxjs'
import { map, tap, filter, shareReplay, distinctUntilChanged, throttleTime } from 'rxjs/operators'
import { useObservable } from 'rxjs-hooks'
import { Msg, makeMsg, InputMsgForRenderer } from 'shared'
import './app.sass'

function sendHeight() {
  window?.parent?.postMessage(
    makeMsg([Msg.From.Renderer, Msg.Category.General], {
      height: document.body.scrollHeight,
    }),
    '*'
  )
}

const fromMsg$ = fromEvent(window, 'message').pipe(
  map((e) => (e as MessageEvent).data),
  tap((data) => {
    console.log(`### Received Message(Not verified):\n`)
    console.log(data)
  }),
  filter((data) => {
    const [from] = data.type as Msg.Type
    return from === Msg.From.Iframe
  }),
  tap((data) => {
    console.log(`Received Message:\n`)
    console.log(data)
  }),
  shareReplay(1)
)

const inputMsg$ = fromMsg$.pipe(
  filter((data) => {
    const [_, category] = data.type as Msg.Type
    return category === Msg.Category.InputChange
  }),
  map((data) => data.content as InputMsgForRenderer)
)

const md$ = inputMsg$.pipe(
  map((data) => data.markdown),
  distinctUntilChanged()
)

combineLatest([md$, animationFrames()])
  .pipe(throttleTime(200))
  .subscribe(() => {
    sendHeight()
  })

function App() {
  const markdown = useObservable(() => md$, '### Markdown Previewer')
  return (
    <div
      css={`
        overflow: auto;
        background-color: #fff;
      `}>
      <Renderer markdown={markdown} />
    </div>
  )
}

export default App
