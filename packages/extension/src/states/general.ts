import { nanoid } from 'nanoid'
import { fromEvent, asyncScheduler, combineLatest, Observable } from 'rxjs'
import { map, take, shareReplay, throttleTime, distinctUntilChanged, filter, tap } from 'rxjs/operators'
import { Msg } from 'shared/msg'
import { $branches } from './github'

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

const $fromMsg = fromEvent(window, 'message').pipe(
  map((e) => (e as MessageEvent).data as Msg.Msg<any>),
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

const editURLSchema = /^https?:\/{2}([^\/]+)\/([^\/]+)\/([^\/]+)\/edit\/([\w\W]+)/
// editURL is like https//{{host}}/{{owner}}/{{repo}}/edit/{{branch_name}}
// e.g. https://github.com/wangpin34/materials/edit/main/README.md

const $parent: Observable<Parent> = $fromMsg.pipe(
  filter(({ type }) => type[1] === Msg.Category.Path),
  map(({ content }) => content as string),
  map((href) => {
    const [_, host, owner, repo, path] = href.match(editURLSchema) as [string, string, string, string, string]
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

// path is like {{branch_name}}{{file_path}}
const $path = $parent.pipe(
  map((parent) => parent.path),
  tap((path) => console.log(`path=${path}`))
)

interface NameTree {
  [p: string]: NameTree
}

const $branchNames = $branches.pipe(
  filter((branches) => Boolean(branches) && branches.length > 0),
  map((branches) => branches.map((branch) => branch.name)),
  tap((names) => {
    console.log(`branch list:\n`)
    console.log(names)
  }),
  map((names) =>
    names.reduce((a, c) => {
      const segments = c.split('/').filter((p) => p)
      let current = a
      for (let segName of segments) {
        if (!current[segName]) {
          current[segName] = {}
        }
        current = current[segName]
      }
      return a
    }, {} as NameTree)
  ),
  tap((nameTree) => console.log(nameTree))
)

// file path is the path without branch
const $branch = combineLatest([$branchNames, $path]).pipe(
  tap(([branchNames, path]) => {
    console.log('Start log $branch...\nbranchNames:\n')
    console.log(branchNames)
    console.log(`path=${path}`)
    console.log('End log $branch')
  }),
  map(([branchNames, path]) => {
    // find the longest match from branch name to path, and that's is the current working branch

    const pathSegs = path.split('/').filter((p) => p)
    let i = 0

    let branchSegs: string[] = []
    let nameTree = branchNames
    while (nameTree[pathSegs[i]]) {
      branchSegs.push(pathSegs[i])
      i++
    }
    return branchSegs.join('/')
  })
)

const $fileRelativePath = combineLatest([$path, $branch]).pipe(map(([path, branch]) => path.replace(`${branch}/`, '')))

export { $input, $path, $branchNames, $branch, $fileRelativePath }
