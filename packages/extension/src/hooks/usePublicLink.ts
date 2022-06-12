import { useMemo } from 'react'
import { useObservable } from 'rxjs-hooks'
import urljoin from 'url-join'
import { $fileRelativePath } from 'states/general'
import { $tree } from 'states/github'

function useTree() {
  return useObservable(() => $tree)
}

function useNodeByPath(path: string | string[]) {
  const tree = useTree()
  if (tree) {
    if (typeof path === 'string') {
      return tree.get(path)
    } else {
      return path.map((p) => tree.get(p))
    }
  }
}

//TODO: make following two items configurable.
const PUBLIC_URL = 'https://github.com'
const DOC_FOLDER = 'content'

// lets see the file are all markdown
function getPWD(filepath: string) {
  let segments = filepath.split('/').filter((s) => s.length)
  // if (/index.mdx?$/.test(filepath)) {
  //   segments = segments.slice(0, -1)
  // }
  return segments.slice(0, -1).join('/')
}

function usePWD() {
  const fileRelativePath = useObservable<string>(() => $fileRelativePath)
  if (fileRelativePath) {
    return getPWD(fileRelativePath)
  }
  return null
}

// Internal link could be relative or absolute, ends with or without .md
function computePath(path: string, root: string) {
  if (path.charAt(0) === '/') {
    return path
  }
  const p = path.split('/').filter((e) => Boolean(e.length))
  const r = root.split('/').filter((e) => Boolean(e.length))

  let i = 0
  let j = 0

  while (i < p.length) {
    const ep = p[i]
    if (ep === '..') {
      i++
      j++
    } else if (ep === '.') {
      i++
    } else {
      break
    }
  }

  return [...r.slice(0, j !== 0 ? -1 * j : r.length), ...p.slice(i)].join('/')
}

function useAbsolutePath(path: string) {
  const pwd = usePWD()
  const target = useMemo(() => {
    if (path.indexOf('/') === 0) {
      return urljoin(DOC_FOLDER, path)
    } else {
      return pwd ? computePath(path, pwd) : null
    }
  }, [path, pwd])
  return target
}

// Check if internal link ( starts from ../ ./ or / ) targets to existing file
function usePathExistence(path: string) {
  const target = useAbsolutePath(path)

  const items = useMemo(() => {
    if (target) {
      let list: string[] = []

      // Remove tail slash "/"
      if (target.charAt(target.length - 1) === '/') {
        list = [target.slice(0, -1)]
      } else {
        list = [target]
      }

      if (list[0].split('/').pop() !== 'index') {
        list[1] = `${list[0]}/index`
      }

      const len = list.length
      for (let i = 0; i < len; i++) {
        if (!/\.mdx?$/.test(list[i])) {
          list[i] += '.md'
          list.push(list[i] + '.mdx')
        }
      }

      return list
    }
  }, [target])

  const nodes = useNodeByPath(items || [])

  const existence = useMemo<boolean>(() => {
    if (nodes) {
      if ((nodes as any[]).map) {
        return (nodes as any[]).some((node) => Boolean(node))
      }
      return Boolean(nodes)
    }
    return false
  }, [nodes])

  return existence
}

function usePublicLink(path: string) {
  const pwd = usePWD()
  const trimContent = pwd?.replace('content', '')
  return useMemo<string>(() => {
    if (path.indexOf('/') === 0) {
      return urljoin(PUBLIC_URL, path)
    }
    return new URL(path, urljoin(PUBLIC_URL, trimContent || '')).href
  }, [trimContent, path])
}

function useFilePublishPath() {
  const fileRelativePath = useObservable<string>(() => $fileRelativePath)
  return fileRelativePath && fileRelativePath?.replace('content', '').replace('/index.md', '')
}

function useFilePublishLink() {
  const filePublishPath = useFilePublishPath()
  return filePublishPath && urljoin(PUBLIC_URL, filePublishPath)
}

export { useAbsolutePath, usePathExistence, useFilePublishLink }

export default usePublicLink
