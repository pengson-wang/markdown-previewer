export function sleep(millseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, millseconds)
  })
}
