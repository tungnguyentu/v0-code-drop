// Initialize the content script
;(() => {
  console.log("Codin content script initialized")

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSelectedText") {
      try {
        const selectedText = window.getSelection().toString()
        sendResponse({ selectedText: selectedText })
      } catch (error) {
        console.error("Error getting selected text:", error)
        sendResponse({ selectedText: "", error: error.message })
      }
    }
    // Return true to indicate that we will send a response asynchronously
    return true
  })
})()
