chrome.runtime.onInstalled.addListener(() => {
  console.log("Codin Snippet Creator extension installed")
})

// Listen for messages from the popup to proxy API requests if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createSnippet") {
    fetch(request.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || `API error: ${response.status}`)
          })
        }
        return response.json()
      })
      .then((data) => {
        sendResponse({ success: true, data })
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message })
      })

    return true // Required to use sendResponse asynchronously
  }
})
