chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(
    tab.id as number,
    { type: 'switch' }
    // function (response) {
    //   if (response) {
    //     const active = response.active
    //     if (active) {
    //       chrome.action.setBadgeText({ text: 'on', tabId: tab.id })
    //     } else {
    //       chrome.action.setBadgeText({ text: '', tabId: tab.id })
    //     }
    //   }
    // }
  )
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (sender.tab) {
    const tabId = sender.tab.id
    const type = request.type
    switch (type) {
      case 'enabled':
        // chrome.tabs.sendMessage(tabId as number, { type: 'enabled' }, function (response) {
        //   if (response && response.active) {
        //     chrome.action.setBadgeText({ text: 'on', tabId })
        //   }
        // })
        chrome.action.setBadgeText({ text: 'on', tabId })
        break
      case 'disabled':
        // chrome.tabs.sendMessage(tabId as number, { type: 'enabled' }, function (response) {
        //   if (response && response.active) {
        //     chrome.action.setBadgeText({ text: 'on', tabId })
        //   }
        // })
        chrome.action.setBadgeText({ text: '', tabId })
      default:
        return
    }
  }
})

export {}
