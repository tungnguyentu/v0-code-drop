// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSelectedCode") {
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

    sendResponse({ code, language })
  }
})

// Add a highlight effect when text is selected
document.addEventListener("mouseup", () => {
  const selection = window.getSelection()
  if (selection.toString().length > 0) {
    // Check if selection is in a code block
    const parentElement = selection.anchorNode.parentElement
    if (parentElement && (parentElement.tagName === "PRE" || parentElement.tagName === "CODE")) {
      // Show a small tooltip that allows saving to Codin
      showSaveTooltip(selection)
    }
  }
})

function showSaveTooltip(selection) {
  // Remove any existing tooltips
  const existingTooltip = document.getElementById("codin-save-tooltip")
  if (existingTooltip) {
    document.body.removeChild(existingTooltip)
  }

  // Get selection coordinates
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  // Create tooltip
  const tooltip = document.createElement("div")
  tooltip.id = "codin-save-tooltip"
  tooltip.innerHTML = `
    <button id="codin-save-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
      Save to Codin
    </button>
  `

  // Style the tooltip
  tooltip.style.cssText = `
    position: absolute;
    top: ${window.scrollY + rect.bottom + 10}px;
    left: ${window.scrollX + rect.left}px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    padding: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `

  // Style the button
  const buttonStyle = `
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: linear-gradient(to right, #10b981, #14b8a6);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
  `

  document.body.appendChild(tooltip)

  const saveButton = document.getElementById("codin-save-button")
  saveButton.style.cssText = buttonStyle

  // Add click handler
  saveButton.addEventListener("click", () => {
    const code = selection.toString()

    // Send message to background script
    chrome.runtime.sendMessage({
      action: "saveSelection",
      code: code,
    })

    // Remove tooltip
    document.body.removeChild(tooltip)
  })

  // Remove tooltip when clicking outside
  document.addEventListener("mousedown", function hideTooltip(e) {
    if (e.target !== tooltip && !tooltip.contains(e.target)) {
      document.body.removeChild(tooltip)
      document.removeEventListener("mousedown", hideTooltip)
    }
  })
}
