chrome.runtime.onInstalled.addListener(() => {
  console.log("Codin Snippet Creator extension installed")
})

// Listen for messages from the popup to proxy API requests if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "makeApiCall") {
    handleApiCall(request.url, request.data)
      .then(result => {
        sendResponse({ success: true, data: result });
      })
      .catch(error => {
        console.error("Background API call failed:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
  
  // Legacy support for createSnippet action
  if (request.action === "createSnippet") {
    handleApiCall(request.url, request.data)
      .then(result => {
        sendResponse({ success: true, data: result });
      })
      .catch(error => {
        console.error("Background snippet creation failed:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
})

async function handleApiCall(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}
