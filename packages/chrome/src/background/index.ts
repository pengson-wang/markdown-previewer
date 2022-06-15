chrome.action.onClicked.addListener((tab) => {
  console.log(`action got clicked within tab[${tab.id}]`)
  chrome.tabs.sendMessage(tab.id as number, { type: 'switch' }, function (response) {
    console.log(`got response from tab[${tab.id}]`)
    if (response) {
      console.log(response)
    }
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`got message from tab[${sender.tab?.id}]`)
  if (sender.tab) {
    const tabId = sender.tab.id
    const type = request.type
    switch (type) {
      case 'enabled':
        chrome.action.setBadgeText({ text: 'on', tabId })
        break
      case 'disabled':
        chrome.action.setBadgeText({ text: '', tabId })
      default:
        return
    }
  }
})
