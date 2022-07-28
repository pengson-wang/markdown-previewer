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
import 'highlight.js/styles/github.css'

export const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSlug)
  .use(remarkToc)
  .use(remarkRehype, {
    allowDangerousHtml: true,
  })
  .use(rehypeRaw)
  .use(rehypeHighlight)
  .use(rehypeReact, {
    createElement: React.createElement,
  })
