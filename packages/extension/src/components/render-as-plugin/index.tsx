import React, { useEffect, useRef } from 'react'
import { combineLatest } from 'rxjs'
import { distinctUntilChanged, map, filter } from 'rxjs/operators'
import { $owner, $repo } from 'states/general'
import { $branch } from 'states/github'
import markdown$ from 'states/markdown'
import { fromEvent } from 'rxjs'
import { useObservable } from 'rxjs-hooks'
import { Msg, makeMsg, InputMsgForRenderer } from 'shared'

const height$ = fromEvent(window, 'message').pipe(
  map((e) => (e as MessageEvent).data as Msg.Msg<any>),
  filter((data) => {
    const [from, category] = data.type
    return from === Msg.From.Renderer && category === Msg.Category.General && typeof data?.content?.height === 'number'
  }),
  map((data) => `${data?.content?.height ?? 100}px`),
  distinctUntilChanged()
)

interface Props {
  url: string
}

const msg$ = combineLatest([$owner, $repo, $branch, markdown$.pipe(distinctUntilChanged())]).pipe(
  map(([owner, repo, branch, markdown]) => {
    return {
      markdown: markdown,
      metadata: {
        owner,
        repo,
        branch,
      },
    } as InputMsgForRenderer
  })
)

export default function Renderer({ url }: Props) {
  const height = useObservable(() => height$, '100%')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (iframeRef.current != null) {
      const subscurion = msg$.subscribe((msg) => {
        iframeRef.current?.contentWindow?.postMessage(makeMsg([Msg.From.Iframe, Msg.Category.InputChange], msg), '*')
      })
      return () => {
        subscurion.unsubscribe()
      }
    }
  }, [])
  return (
    <iframe
      ref={iframeRef}
      title="render-plugin"
      src={url}
      css={`
        width: 100%;
        height: ${height};
      `}></iframe>
  )
}
