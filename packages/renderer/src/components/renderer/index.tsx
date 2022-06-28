import React, { useMemo, ComponentType } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeReact from 'rehype-react'
import { P, H1, H2, CodeBlock, InlineCode, A, Blockquote, Table, Ol, Ul, Image } from './elements'
import 'highlight.js/styles/github.css'

//@ts-ignore
const processor = unified()
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
    components: {
      a: A as ComponentType<JSX.IntrinsicElements['a']>,
      blockquote: Blockquote as ComponentType<JSX.IntrinsicElements['blockquote']>,
      pre: CodeBlock as ComponentType<JSX.IntrinsicElements['pre']>,
      code: InlineCode as ComponentType<JSX.IntrinsicElements['strong']>,
      h1: H1 as ComponentType<JSX.IntrinsicElements['h1']>,
      h2: H2 as ComponentType<JSX.IntrinsicElements['h2']>,
      p: P as ComponentType<JSX.IntrinsicElements['p']>,
      table: Table as ComponentType<JSX.IntrinsicElements['table']>,
      ol: Ol as ComponentType<JSX.IntrinsicElements['ol']>,
      ul: Ul as ComponentType<JSX.IntrinsicElements['ul']>,
      img: Image as ComponentType<JSX.IntrinsicElements['img']>,
    },
  })

interface Props {
  markdown: string
}

export default function Renderer({ markdown }: Props) {
  //@ts-ignore
  const children = useMemo(() => (markdown ? processor.processSync(markdown).result.props.children : ''), [markdown])

  return (
    <div
      className="box-border"
      css={`
        background-color: #fff;
        padding: 40px;
      `}>
      {children}
    </div>
  )
}
