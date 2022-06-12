function isExternalLink(link: string) {
  return /^(https?:)?\/\//.test(link)
}

export { isExternalLink }
