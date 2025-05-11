document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const apiKeyInput = document.getElementById("api-key")
  const showApiKeyButton = document.getElementById("show-api-key")
  const saveApiKeyButton = document.getElementById("save-api-key")
  const getApiKeyLink = document.getElementById("get-api-key")
  const defaultLanguageSelect = document.getElementById("default-language")
  const defaultThemeSelect = document.getElementById("default-theme")
  const defaultExpirationSelect = document.getElementById("default-expiration")
  const saveDefaultsButton = document.getElementById("save-defaults")
  const showContextMenuCheckbox = document.getElementById("show-context-menu")
  const showInlineTooltipCheckbox = document.getElementById("show-inline-tooltip")
  const saveOptionsButton = document.getElementById("save-options")

  // Load saved settings
  loadSettings()

  // Show/hide API key
  showApiKeyButton.addEventListener("click", () => {
    if (apiKeyInput.type === "password") {
      apiKeyInput.type = "text"
      showApiKeyButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
    } else {
      apiKeyInput.type = "password"
      showApiKeyButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
    }
  })

  // Save API key
  saveApiKeyButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim()

    if (!apiKey) {
      showNotification("API key cannot be empty", "error")
      return
    }

    chrome.storage.sync.set({ apiKey: apiKey }, () => {
      showNotification("API key saved successfully", "success")
    })
  })

  // Get API key link
  getApiKeyLink.addEventListener("click", (e) => {
    e.preventDefault()
    // Open Codin website in a new tab
    chrome.tabs.create({ url: "https://codin.example.com/settings/api" })
  })

  // Save default settings
  saveDefaultsButton.addEventListener("click", () => {
    const defaultLanguage = defaultLanguageSelect.value
    const defaultTheme = defaultThemeSelect.value
    const defaultExpiration = defaultExpirationSelect.value

    chrome.storage.sync.set(
      {
        defaultLanguage,
        defaultTheme,
        defaultExpiration,
      },
      () => {
        showNotification("Default settings saved successfully", "success")
      },
    )
  })

  // Save extension options
  saveOptionsButton.addEventListener("click", () => {
    const showContextMenu = showContextMenuCheckbox.checked
    const showInlineTooltip = showInlineTooltipCheckbox.checked

    chrome.storage.sync.set(
      {
        showContextMenu,
        showInlineTooltip,
      },
      () => {
        // Update context menu
        if (showContextMenu) {
          chrome.contextMenus.create({
            id: "saveToCodin",
            title: "Save to Codin",
            contexts: ["selection"],
          })
        } else {
          chrome.contextMenus.remove("saveToCodin")
        }

        showNotification("Extension options saved successfully", "success")
      },
    )
  })

  // Load saved settings
  function loadSettings() {
    chrome.storage.sync.get(
      ["apiKey", "defaultLanguage", "defaultTheme", "defaultExpiration", "showContextMenu", "showInlineTooltip"],
      (result) => {
        if (result.apiKey) {
          apiKeyInput.value = result.apiKey
        }

        if (result.defaultLanguage) {
          defaultLanguageSelect.value = result.defaultLanguage
        }

        if (result.defaultTheme) {
          defaultThemeSelect.value = result.defaultTheme
        }

        if (result.defaultExpiration) {
          defaultExpirationSelect.value = result.defaultExpiration
        }

        showContextMenuCheckbox.checked = result.showContextMenu !== false // Default to true
        showInlineTooltipCheckbox.checked = result.showInlineTooltip !== false // Default to true
      },
    )
  }

  // Show notification
  function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      document.body.removeChild(existingNotification)
    }

    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Style the notification
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease-out forwards;
    `

    if (type === "success") {
      notification.style.backgroundColor = "#d1fae5"
      notification.style.color = "#059669"
    } else {
      notification.style.backgroundColor = "#fee2e2"
      notification.style.color = "#dc2626"
    }

    // Add animation styles
    const style = document.createElement("style")
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    // Add to DOM
    document.body.appendChild(notification)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in forwards"
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }
})
