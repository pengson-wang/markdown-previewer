import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeReact from 'rehype-react'
import React from 'react'
import normalize from 'mdurl/encode.js'
import { Handler, H } from 'mdast-util-to-hast'

// Internal link could be relative or absolute, ends with or without .md
function computePath(path: string, pwd: string) {
  if (path.charAt(0) === '/') {
    return path
  }

  let i = 0
  let j = 0

  while (i < path.length) {
    const indexP = path.indexOf('/', i)
    if (indexP < 0) {
      break
    }
    const ep = path.slice(i, indexP)
    if (ep === '..') {
      i = indexP + 1
      j++
    } else if (ep === '.') {
      i = indexP + 1
    } else {
      break
    }
  }

  const resolvedPath = path.slice(i)
  let resolvedParent = pwd.charAt(pwd.length - 1) === '/' ? pwd : pwd + '/'

  while (j > 0) {
    resolvedParent = resolvedParent.slice(0, -1)
    if (resolvedParent.length < 1) {
      break
    }
    resolvedParent = resolvedParent.slice(0, -1 * resolvedParent.lastIndexOf('/'))
  }

  return `${resolvedParent}${resolvedPath}`
}

function getAbsolutePath(path: string, pwd: string) {
  if (!!path && !!pwd) {
    if (path.charAt(0) === '/') {
      return path
    } else {
      return computePath(path, pwd)
    }
  }
  return '/'
}

interface Options {
  owner: string
  repo: string
  branch: string
  pwd: string
}

function genImageHandler(options: Options) {
  const handler: Handler = (h: H, node: any) => {
    const props = { src: normalize(node.url), alt: node.alt }
    if (!/^https?:\/\//.test(props.src)) {
      const absolutePath = getAbsolutePath(props.src, options.pwd)
      //props.src = makeURLFromPath(absolutePath, options.owner, options.repo, options.branch)
      props.src = `https://github.com/${options.owner}/${options.repo}/raw/${options.branch}/${absolutePath}`
    }
    return h(node, 'img', props)
  }
  return handler
}

export function getProcessor(options: Options) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSlug)
    .use(remarkToc)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      handlers: {
        image: genImageHandler(options),
      },
    })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeReact, {
      createElement: React.createElement,
    })
}

export const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSlug)
  .use(remarkToc)
  .use(remarkRehype, {
    allowDangerousHtml: true,
    handlers: {},
  })
  .use(rehypeRaw)
  .use(rehypeHighlight)
  .use(rehypeReact, {
    createElement: React.createElement,
  })
