document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const createForm = document.getElementById("create-form")
  const resultSection = document.getElementById("result")
  const loadingSection = document.getElementById("loading")
  const errorSection = document.getElementById("error")
  const errorMessage = document.getElementById("error-message")

  const titleInput = document.getElementById("title")
  const contentInput = document.getElementById("content")
  const languageSelect = document.getElementById("language")
  const themeSelect = document.getElementById("theme")
  const expirationSelect = document.getElementById("expiration")
  const viewLimitSelect = document.getElementById("viewLimit")
  const passwordToggle = document.getElementById("password-toggle")
  const passwordFields = document.getElementById("password-fields")
  const passwordInput = document.getElementById("password")
  const togglePasswordBtn = document.getElementById("toggle-password")
  const eyeIcon = document.getElementById("eye-icon")
  const eyeOffIcon = document.getElementById("eye-off-icon")

  const createButton = document.getElementById("create-button")
  const snippetUrlInput = document.getElementById("snippet-url")
  const copyUrlButton = document.getElementById("copy-url")
  const copyIcon = document.getElementById("copy-icon")
  const checkIcon = document.getElementById("check-icon")
  const passwordNotice = document.getElementById("password-notice")
  const createNewButton = document.getElementById("create-new")
  const tryAgainButton = document.getElementById("try-again")

  // Correct API URL for creating snippets
  const API_URL = "https://codin.site/api/create"

  // Event listeners
  passwordToggle.addEventListener("change", function () {
    passwordFields.classList.toggle("hidden", !this.checked)
    if (!this.checked) {
      passwordInput.value = ""
    }
  })

  togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)
    eyeIcon.classList.toggle("hidden")
    eyeOffIcon.classList.toggle("hidden")
  })

  createButton.addEventListener("click", createSnippet)
  copyUrlButton.addEventListener("click", copyToClipboard)
  createNewButton.addEventListener("click", resetForm)
  tryAgainButton.addEventListener("click", () => {
    errorSection.classList.add("hidden")
    createForm.classList.remove("hidden")
  })

  // Check if there's selected text in the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, (response) => {
      if (response && response.selectedText) {
        contentInput.value = response.selectedText

        // Try to detect language based on the file extension or content
        detectLanguage(tabs[0].url, response.selectedText)
      }
    })
  })

  // Function to detect language based on URL or content
  function detectLanguage(url, content) {
    // Simple detection based on file extension in URL
    if (url) {
      const fileExtension = url.split(".").pop().toLowerCase()

      const extensionMap = {
        js: "javascript",
        ts: "typescript",
        py: "python",
        java: "java",
        cs: "csharp",
        cpp: "cpp",
        c: "cpp",
        go: "go",
        rs: "rust",
        php: "php",
        rb: "ruby",
        html: "html",
        css: "css",
        sql: "sql",
        json: "json",
        md: "markdown",
        sh: "bash",
      }

      if (extensionMap[fileExtension]) {
        languageSelect.value = extensionMap[fileExtension]
        return
      }
    }

    // More advanced detection could be added here
  }

  // Function to create a snippet using the actual API
  async function createSnippet() {
    const title = titleInput.value.trim()
    const content = contentInput.value.trim()
    const language = languageSelect.value
    const expiration = expirationSelect.value
    const viewLimit = viewLimitSelect.value
    const isPasswordProtected = passwordToggle.checked
    const password = isPasswordProtected ? passwordInput.value : ""

    // Validate content
    if (!content) {
      showError("Content is required")
      return
    }

    // Validate password if protection is enabled
    if (isPasswordProtected && !password) {
      showError("Password is required when protection is enabled")
      return
    }

    // Show loading state
    createForm.classList.add("hidden")
    loadingSection.classList.remove("hidden")

    try {
      // Prepare the request payload based on the Codin API structure
      const payload = {
        title: title || null,
        content: content,
        language: language,
        expiration: expiration,
        viewLimit: viewLimit,
        password: isPasswordProtected ? password : undefined,
      }

      let response, data

      try {
        // Try direct API call first
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || `API error: ${response.status}`)
        }
      } catch (directApiError) {
        // If direct API call fails, try using the background script
        console.log("Direct API call failed, trying via background script:", directApiError)

        data = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(
            {
              action: "createSnippet",
              url: API_URL,
              data: payload,
            },
            (response) => {
              if (response && response.success) {
                resolve(response.data)
              } else {
                reject(new Error(response?.error || "Failed to create snippet via background"))
              }
            },
          )
        })
      }

      // Check if the API call was successful
      if (!data.success) {
        throw new Error(data.message || "Failed to create snippet")
      }

      // Get the snippet ID from the response
      const snippetId = data.shortId
      if (!snippetId) {
        throw new Error("Invalid response from server: missing snippet ID")
      }

      // Generate the snippet URL
      const snippetUrl = `https://codin.site/${snippetId}`

      // Show result
      loadingSection.classList.add("hidden")
      resultSection.classList.remove("hidden")
      snippetUrlInput.value = snippetUrl

      // Show password notice if applicable
      passwordNotice.classList.toggle("hidden", !isPasswordProtected)

      // Save to local storage for history
      saveToHistory({
        id: snippetId,
        title: title || "Untitled Snippet",
        language,
        createdAt: new Date().toISOString(),
        url: snippetUrl,
        isPasswordProtected,
      })
    } catch (error) {
      console.error("Error creating snippet:", error)
      loadingSection.classList.add("hidden")
      errorSection.classList.remove("hidden")
      errorMessage.textContent = error.message || "Failed to create snippet. Please try again."
    }
  }

  // Function to copy URL to clipboard
  function copyToClipboard() {
    snippetUrlInput.select()
    navigator.clipboard
      .writeText(snippetUrlInput.value)
      .then(() => {
        // Show success state
        copyIcon.classList.add("hidden")
        checkIcon.classList.remove("hidden")

        // Reset after 2 seconds
        setTimeout(() => {
          copyIcon.classList.remove("hidden")
          checkIcon.classList.add("hidden")
        }, 2000)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  // Function to reset the form
  function resetForm() {
    titleInput.value = ""
    contentInput.value = ""
    languageSelect.value = "plaintext"
    themeSelect.value = "vs"
    expirationSelect.value = "1d"
    viewLimitSelect.value = "unlimited"
    passwordToggle.checked = false
    passwordFields.classList.add("hidden")
    passwordInput.value = ""

    resultSection.classList.add("hidden")
    createForm.classList.remove("hidden")
  }

  // Function to show error
  function showError(message) {
    createForm.classList.add("hidden")
    errorSection.classList.remove("hidden")
    errorMessage.textContent = message
  }

  // Function to save snippet to history
  function saveToHistory(snippet) {
    chrome.storage.local.get(["snippetHistory"], (result) => {
      const history = result.snippetHistory || []
      history.unshift(snippet)

      // Keep only the last 50 snippets
      if (history.length > 50) {
        history.pop()
      }

      chrome.storage.local.set({ snippetHistory: history })
    })
  }
})
