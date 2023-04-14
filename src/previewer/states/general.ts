import { nanoid } from 'nanoid'
import { fromEvent, asyncScheduler, Observable } from 'rxjs'
import { map, take, shareReplay, throttleTime, distinctUntilChanged, filter, tap } from 'rxjs/operators'
import { Msg } from 'types'

export function makeMsg<T>(type: Msg.Type, content: T) {
  return {
    id: nanoid(),
    type: type,
    content: content,
  } as Msg.Msg<T>
}

function isValidMsg(msg: any) {
  if (msg) {
    return typeof msg.id === 'string' && msg.type instanceof Array && msg.type.length >= 2
  }

  return false
}

export const $fromMsg = fromEvent(window, 'message').pipe(
  map((e) => (e as MessageEvent).data as Msg.Msg<any>),
  tap((data) => {
    console.log(`Received Message(Not verified):\n`)
    console.log(data)
  }),
  filter((data) => isValidMsg(data)),
  tap((data) => {
    console.log(`Received Message:\n`)
    console.log(data)
  }),
  shareReplay(10)
)

export function send<T>(msg: Msg.Msg<T>) {
  window.parent.postMessage(msg, '*')
}

export function sendReadySignal() {
  console.log('send appready signal')
  send(makeMsg([Msg.From.Iframe, Msg.Category.IframeReady], true))
}

const $input = $fromMsg.pipe(
  filter(({ type: [, category] }) => category === Msg.Category.InputChange),
  map(({ content }) => content as string),
  throttleTime(100, asyncScheduler, {
    leading: true,
    trailing: true,
  }),
  distinctUntilChanged()
)

interface Parent {
  host: string
  owner: string
  repo: string
  path: string
}

//eslint-disable-next-line
const editURLSchema = /^https?:\/{2}([^\/]+)\/([^\/]+)\/([^\/]+)\/edit\/([\w\W]+)/
// editURL is like https//{{host}}/{{owner}}/{{repo}}/edit/{{branch_name}}
// e.g. https://github.com/wangpin34/materials/edit/main/README.md

const $parent: Observable<Parent> = $fromMsg.pipe(
  filter(({ type }) => type[1] === Msg.Category.Path),
  map(({ content }) => content as string),
  map((href) => {
    const [, host, owner, repo, path] = href.match(editURLSchema) as [string, string, string, string, string]
    return {
      host,
      owner,
      repo,
      path,
    } as Parent
  }),
  shareReplay(1),
  take(1)
)
const $host = $parent.pipe(map((p) => p.host))
const $owner = $parent.pipe(map((p) => p.owner))
const $repo = $parent.pipe(map((p) => p.repo))

// path is like {{branch_name}}{{file_path}}
const $path = $parent.pipe(
  map((parent) => parent.path),
  tap((path) => console.log(`path=${path}`))
)

export { $input, $parent, $host, $owner, $repo, $path }
