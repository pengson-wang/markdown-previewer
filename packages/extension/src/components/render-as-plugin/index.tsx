import React, { useEffect, useRef, useCallback } from 'react'
import { combineLatest } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { $owner, $repo } from 'states/general'
import { $branch } from 'states/github'
import markdown$ from 'states/markdown'

interface Props {
  url: string
}

const msg$ = combineLatest([$owner, $repo, $branch, markdown$.pipe(distinctUntilChanged())]).pipe(
  map(([owner, repo, branch, markdown]) => {
    return {
      sender: 'previewer-host',
      markdown: markdown,
      metadata: {
        owner,
        repo,
        branch,
      },
    }
  })
)

export default function Renderer({ url }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (iframeRef.current != null) {
      const subscurion = msg$.subscribe((msg) => {
        iframeRef.current?.contentWindow?.postMessage(msg, '*')
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
        height: 100%;
      `}></iframe>
  )
}
