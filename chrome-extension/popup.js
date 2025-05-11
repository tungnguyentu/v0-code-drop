document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const loginSection = document.getElementById("login-section")
  const mainSection = document.getElementById("main-section")
  const resultSection = document.getElementById("result")
  const loginForm = document.getElementById("login-form")
  const apiKeyInput = document.getElementById("api-key")
  const getApiKeyLink = document.getElementById("get-api-key")
  const titleInput = document.getElementById("title")
  const languageSelect = document.getElementById("language")
  const themeSelect = document.getElementById("theme")
  const expirationSelect = document.getElementById("expiration")
  const contentTextarea = document.getElementById("content")
  const captureButton = document.getElementById("capture-button")
  const saveButton = document.getElementById("save-button")
  const snippetUrlInput = document.getElementById("snippet-url")
  const copyUrlButton = document.getElementById("copy-url")
  const newSnippetButton = document.getElementById("new-snippet")
  const settingsButton = document.getElementById("settings-button")
  const logoutButton = document.getElementById("logout-button")

  // Check if user is logged in
  chrome.storage.sync.get(["apiKey"], (result) => {
    if (result.apiKey) {
      showMainSection()
    } else {
      showLoginSection()
    }
  })

  // Login form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const apiKey = apiKeyInput.value.trim()

    if (!apiKey) {
      showError(apiKeyInput, "API key is required")
      return
    }

    // Validate API key (in a real extension, you would verify with your backend)
    // For this example, we'll just save it
    chrome.storage.sync.set({ apiKey: apiKey }, () => {
      showMainSection()
    })
  })

  // Get API key link
  getApiKeyLink.addEventListener("click", (e) => {
    e.preventDefault()
    // Open Codin website in a new tab
    chrome.tabs.create({ url: "https://codin.example.com/settings/api" })
  })

  // Capture code from the current page
  captureButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: captureSelectedCode,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const { code, language } = results[0].result
            contentTextarea.value = code

            // Try to detect language if available
            if (language && languageSelect.querySelector(`option[value="${language}"]`)) {
              languageSelect.value = language
            }
          }
        },
      )
    })
  })

  // Save snippet to Codin
  saveButton.addEventListener("click", () => {
    const title = titleInput.value.trim()
    const language = languageSelect.value
    const theme = themeSelect.value
    const expiration = expirationSelect.value
    const content = contentTextarea.value.trim()

    if (!content) {
      showError(contentTextarea, "Code snippet cannot be empty")
      return
    }

    saveButton.disabled = true
    saveButton.textContent = "Saving..."

    // In a real extension, you would send this to your API
    // For this example, we'll simulate a successful save
    setTimeout(() => {
      const snippetId = generateRandomId()
      const snippetUrl = `https://codin.example.com/${snippetId}`

      snippetUrlInput.value = snippetUrl
      showResultSection()

      saveButton.disabled = false
      saveButton.textContent = "Save to Codin"
    }, 1000)
  })

  // Copy snippet URL
  copyUrlButton.addEventListener("click", () => {
    snippetUrlInput.select()
    document.execCommand("copy")

    const originalSvg = copyUrlButton.innerHTML
    copyUrlButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'

    setTimeout(() => {
      copyUrlButton.innerHTML = originalSvg
    }, 2000)
  })

  // Create new snippet
  newSnippetButton.addEventListener("click", () => {
    titleInput.value = ""
    contentTextarea.value = ""
    showMainSection()
  })

  // Settings button
  settingsButton.addEventListener("click", () => {
    // Open settings page in a new tab
    chrome.tabs.create({ url: "settings.html" })
  })

  // Logout button
  logoutButton.addEventListener("click", () => {
    chrome.storage.sync.remove("apiKey", () => {
      showLoginSection()
    })
  })

  // Helper functions
  function showLoginSection() {
    loginSection.classList.remove("hidden")
    mainSection.classList.add("hidden")
    resultSection.classList.add("hidden")
    logoutButton.classList.add("hidden")
  }

  function showMainSection() {
    loginSection.classList.add("hidden")
    mainSection.classList.remove("hidden")
    resultSection.classList.add("hidden")
    logoutButton.classList.remove("hidden")
  }

  function showResultSection() {
    mainSection.querySelector("h2").classList.add("hidden")
    mainSection.querySelectorAll(".form-group, .button-group").forEach((el) => {
      el.classList.add("hidden")
    })
    resultSection.classList.remove("hidden")
  }

  function showError(element, message) {
    element.classList.add("error")
    const errorElement = document.createElement("div")
    errorElement.className = "error-message"
    errorElement.textContent = message

    const parent = element.parentElement
    const existingError = parent.querySelector(".error-message")
    if (existingError) {
      parent.removeChild(existingError)
    }

    parent.appendChild(errorElement)

    element.addEventListener(
      "input",
      () => {
        element.classList.remove("error")
        const error = parent.querySelector(".error-message")
        if (error) {
          parent.removeChild(error)
        }
      },
      { once: true },
    )
  }

  function generateRandomId() {
    return Math.random().toString(36).substring(2, 10)
  }
})

// Function to capture selected code from the page
function captureSelectedCode() {
  const selection = window.getSelection()
  let code = selection.toString()
  let language = "plaintext"

  // If there's no selection, try to find code elements
  if (!code) {
    const activeElement = document.activeElement
    if (activeElement && (activeElement.tagName === "PRE" || activeElement.tagName === "CODE")) {
      code = activeElement.textContent

      // Try to detect language from class
      const classes = activeElement.className.split(" ")
      for (const cls of classes) {
        if (cls.startsWith("language-")) {
          language = cls.replace("language-", "")
          break
        }
      }
    }
  } else {
    // Try to detect if selection is within a code block
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
