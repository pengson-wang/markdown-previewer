async function set<T>(key: string, value: T) {
  return await new Promise<boolean>((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve(true)
    })
  })
}

async function get<T>(key: string) {
  return await new Promise<T>((resolve) => {
    chrome.storage.sync.get([key], (result: any) => {
      resolve(result[key] as T)
    })
  })
}

export { get, set }
