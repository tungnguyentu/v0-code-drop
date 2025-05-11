// Set up context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToCodin",
    title: "Save to Codin",
    contexts: ["selection"],
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToCodin") {
    // Open popup with the selected text
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      chrome.action.openPopup()
    })
  }
})

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureCode") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: captureSelectedCode,
        },
        (results) => {
          if (results && results.length > 0 && results[0].result) {
            sendResponse({ result: results[0].result })
          } else {
            sendResponse({ result: { code: "", language: "plaintext" } })
          }
        },
      )
    })
    return true // Required for async sendResponse
  }
})

// Function to capture selected code
function captureSelectedCode() {
  const selection = window.getSelection()
  const code = selection.toString()
  let language = "plaintext"

  // Try to detect language from context
  if (code) {
    const parentElement = selection.anchorNode.parentElement
    if (parentElement && (parentElement.tagName === "PRE" || parentElement.tagName === "CODE")) {
      const classes = parentElement.className.split(" ")
      for (const cls of classes) {
        if (cls.startsWith("language-")) {
          language = cls.replace("language-", "")
          break
        }
      }
    }
  }

  return { code, language }
}
