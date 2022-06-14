//@ts-nocheck
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useMemo } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeReact from 'rehype-react'
import { P, H1, H2, CodeBlock, InlineCode, A, Blockquote, Table, Ol, Ul } from './elements'
import { useObservable } from 'rxjs-hooks'
import { $input } from 'states/general'
import 'highlight.js/styles/github.css'

//@ts-ignore
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSlug)
  .use(remarkToc)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeReact, {
    createElement: React.createElement,
    components: { a: A, blockquote: Blockquote, pre: CodeBlock, code: InlineCode, h1: H1, h2: H2, p: P, table: Table, ol: Ol, ul: Ul },
  })

export default function Renderer() {
  const markdown = useObservable(() => $input)
  //@ts-ignore
  const children = useMemo(() => (markdown ? processor.processSync(markdown).result.props.children : ''), [markdown])

  return (
    <div
      className="box-border"
      sx={{
        backgroundColor: '#fff',
        padding: '40px',
      }}>
      {children}
    </div>
  )
}
