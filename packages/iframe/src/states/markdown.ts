/**
 * resolved markdown, such as replace relative path of image as public url
 */

import { $input } from './general'
import { $filePath } from './github'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { $owner, $repo } from './general'
import { $branch } from './github'
import { getRepoContents } from 'services/github/index'

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

const linkMap = new Map<string, string>()

const imageRegex = /(?<=!)\[([^\[\]]+)\]\(([^\(\)]*)\)/gi

const isPublicURL = (src: string) => /^(https?:)?\/\//.test(src)

const markdown$ = new BehaviorSubject<string>('')

async function getProtectedImage(path: string, repo: string, branch: string) {
  // Fetch the image.
  const response = await getRepoContents(path, repo, branch)

  if (response.status === 200) {
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    return objectUrl
  }
}

combineLatest([$input, $filePath, $owner, $repo, $branch])
  .pipe(
    map(([input, filePath, owner, repo, branch]) => ({
      input,
      filePath,
      owner,
      repo,
      branch,
    }))
  )
  .subscribe(({ input, filePath, owner, repo, branch }) => {
    ;(async () => {
      const links = Array.from(input.matchAll(imageRegex)).map(([, alt, src]) => ({ alt, src }))
      const pwd = filePath?.substring(0, filePath.lastIndexOf('/') + 1) as string
      const resolvedLink = await Promise.all(
        links.map(async ({ alt, src }) => {
          if (isPublicURL(src)) {
            return { alt, src, origin: src }
          }
          if (linkMap.has(src)) {
            return { alt, src: linkMap.get(src), origin: src }
          }
          const imagePath = getAbsolutePath(src, pwd)
          const imageURL = await getProtectedImage(imagePath, `${owner}/${repo}`, branch)
          return { alt, src: imageURL ?? imagePath, origin: src }
        })
      )
      // modifiy markdown
      let markdown = input
      resolvedLink.forEach(({ alt, src, origin }) => {
        markdown = markdown.replace(`![${alt}](${origin})`, `![${alt}](${src})`)
      })
      markdown$.next(markdown)
    })()
  })

export default markdown$
