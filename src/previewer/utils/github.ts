import urljoin from 'url-join'
import { getRepoContents } from 'previewer/services/github'
const BASE = 'https://api.github.com'

export function makeURL(...parts: string[]) {
  return new URL(urljoin('', ...parts), BASE).toString()
}

export function makeURLFromPath(path: string, owner: string, repo: string, branch: string) {
  return makeURL(`${urljoin('/repos', `${owner}/${repo}`, 'contents', path)}?branch=${branch}`)
}

export async function getProtectedImage(path: string, repo: string, branch: string) {
  // Fetch the image.
  const response = await getRepoContents(path, repo, branch)

  if (response.status === 200) {
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    return objectUrl
  }
}
