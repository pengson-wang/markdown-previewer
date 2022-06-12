/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useEffect, useState } from 'react'
import { useObservable } from 'rxjs-hooks'
import { $input } from 'states/general'
import { getRepoContents } from 'services/github'
import { isExternalLink } from 'utils/link'
import usePublicLink, { usePathExistence, useAbsolutePath } from 'hooks/usePublicLink'

async function displayProtectedImage(path: string) {
  // Fetch the image.
  const response = await getRepoContents(path)

  if (response.status === 200) {
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    return objectUrl
  }
}

function InternalImage({ src, ...rest }: { src: string }) {
  const href = useAbsolutePath(src)
  const [objectURL, setURL] = useState<string>()
  useEffect(() => {
    ;(async () => {
      if (href) {
        const url = await displayProtectedImage(href)
        url && setURL(url)
      }
    })()
  }, [href])
  return <img {...rest} src={objectURL} data-src={objectURL} />
}

function Image({ src, ...rest }: { src: string }) {
  if (isExternalLink(src)) {
    return <img src={src} {...rest} />
  }
  return <InternalImage src={src} {...rest} />
}

function MarkdownRenderer() {
  const markdown = useObservable(() => $input)
  return <pre>{markdown}</pre>
}

export default MarkdownRenderer
