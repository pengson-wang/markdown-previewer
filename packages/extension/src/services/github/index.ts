/*
 * Author: Wang Pin <pin.wang@hp.com>
 *
 * © Copyright 2021 HP Development Company, L.P.
 */

import urljoin from 'url-join'
import base64 from 'base-64'
import { getUsername, getPassword } from './getEnv'

const BASE = 'https://github.com'

interface Headers {
  [p: string]: string
}
let _baseHeaders: Headers

function getHeaders(additionHeaders?: Headers) {
  if (!_baseHeaders) {
    _baseHeaders = {
      Authorization: `Basic ${base64.encode(`${getUsername()}:${getPassword()}`)}`,
    }
  }
  return additionHeaders
    ? {
        ...additionHeaders,
        ..._baseHeaders,
      }
    : {
        ..._baseHeaders,
      }
}

export interface Options {
  headers?: {
    [p: string]: string
  }
  query?: URLSearchParams
}

function makeURL(...parts: string[]) {
  return new URL(urljoin('/api/v3', ...parts), BASE).toString()
}

export async function get(from: string, options?: Options) {
  const query = options?.query?.toString()
  return fetch(makeURL(from, query ? `?${query}` : ''), {
    method: 'GET',
    headers: getHeaders(options && options.headers),
  })
}

export async function getRepoContents(path: string, repo: string, branch: string) {
  return get(urljoin('/repos', repo, 'contents', path), {
    query: new URLSearchParams([['branch', branch]]),
    headers: { Accept: 'application/vnd.github.VERSION.raw' },
  })
}

export async function getJson<T>(path: string, options?: Options) {
  try {
    const resp = await get(path, options)
    if (resp.status < 400 && (resp.headers.get('content-type') as string).indexOf('application/json') > -1) {
      const body: T = await resp.json()
      return body
    } else {
      throw new Error(`${resp.status} ${resp.statusText}\n${await resp.text()}`)
    }
  } catch (err) {
    throw err
  }
}

export interface Branch {
  name: string
  commit: {
    sha: string
    url: string
  }
}

export async function getBranches(repo: string, perPage = 30, page = 1) {
  return getJson<Branch[]>(urljoin('/repos', repo, 'branches'), {
    query: new URLSearchParams([
      ['per_page', perPage + ''],
      ['page', page + ''],
    ]),
  })
}

export async function getFileContent(repo: string, from: string, options?: Options) {
  try {
    const body = await getJson<{
      content: string
      encoding: 'base64' | string
    }>(urljoin('/repos', repo, 'contents', from), options)
    if (body.encoding === 'base64') {
      return base64.decode(body.content)
    } else {
      throw new Error(`encoding format ${body.encoding} is not supported`)
    }
  } catch (err) {
    throw err
  }
}

export interface TreeNode {
  path: string
  mode: string
  type: 'tree' | 'blob'
  size?: number
  sha: string
  url: string
}

let _allTree: Array<TreeNode>

export async function getTree(repo: string, branch: string, path?: string) {
  if (!_allTree) {
    const resp = await getJson<{
      sha: string
      url: string
      tree: Array<TreeNode>
    }>(urljoin('/repos', repo, 'git/trees', branch), { query: new URLSearchParams([['recursive', `true`]]) })
    _allTree = resp.tree
  }
  if (path) {
    const regExp = new RegExp(`^${path}\/`, '')
    return _allTree.filter((tree) => regExp.test(tree.path))
  }
  return _allTree
}
