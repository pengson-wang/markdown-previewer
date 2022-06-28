import Renderer from 'components/renderer'
import { fromEvent } from 'rxjs'
import { map, tap, filter, shareReplay } from 'rxjs/operators'
import { useObservable } from 'rxjs-hooks'
import './app.sass'

function isValidMsg(data: any) {
  return data['sender'] === 'previewer-host'
}

const fromMsg$ = fromEvent(window, 'message').pipe(
  map((e) => (e as MessageEvent).data),
  tap((data) => {
    console.log(`### Received Message(Not verified):\n`)
    console.log(data)
  }),
  filter((data) => isValidMsg(data)),
  tap((data) => {
    console.log(`Received Message:\n`)
    console.log(data)
  }),
  shareReplay(10)
)

const md$ = fromMsg$.pipe(
  filter((data) => !!data && data.markdown),
  map((data: any) => data.markdown as string)
)

function App() {
  const markdown = useObservable(() => md$, '### Markdown Previewer')
  return (
    <div
      css={`
        max-height: 100vh;
        overflow: auto;
        background-color: #fff;
      `}>
      <Renderer markdown={markdown} />
    </div>
  )
}

export default App
