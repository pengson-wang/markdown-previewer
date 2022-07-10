class MyStorage {
  sync: boolean
  constructor(sync = false) {
    this.sync = sync
  }
  async set<T>(key: string, value: T) {
    return new Promise((resolve) => {
      console.log(`Saving info to storage`)
      chrome.storage[this.sync ? 'sync' : 'local'].set({ [key]: value }, function () {
        resolve('Value is set to ' + value)
      })
    })
  }
  async get<T>(key: string) {
    return new Promise<T>((resolve) => {
      console.log(`Getting info from storage`)
      chrome.storage[this.sync ? 'sync' : 'local'].get(key, function (result) {
        resolve(result[key])
      })
    })
  }
}

export default MyStorage
