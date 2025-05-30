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

  // Owner code elements
  const ownerCodeInput = document.getElementById("owner-code")
  const copyOwnerCodeButton = document.getElementById("copy-owner-code")
  const copyOwnerIcon = document.getElementById("copy-owner-icon")
  const checkOwnerIcon = document.getElementById("check-owner-icon")
  
  // Clear recent button
  const clearRecentButton = document.getElementById("clear-recent")

  // Check if all required elements exist
  if (!createForm || !resultSection || !loadingSection || !errorSection || 
      !titleInput || !contentInput || !createButton || !snippetUrlInput || 
      !ownerCodeInput || !createNewButton || !clearRecentButton) {
    console.error("One or more required DOM elements not found")
    console.log("Elements found:", {
      createForm: !!createForm,
      resultSection: !!resultSection,
      loadingSection: !!loadingSection,
      errorSection: !!errorSection,
      titleInput: !!titleInput,
      contentInput: !!contentInput,
      createButton: !!createButton,
      snippetUrlInput: !!snippetUrlInput,
      ownerCodeInput: !!ownerCodeInput,
      createNewButton: !!createNewButton,
      clearRecentButton: !!clearRecentButton
    })
    return
  }
  
  console.log("Chrome extension loaded successfully - all required elements found")

  // API Configuration
  // For production (default):
  const API_URL = "https://codin.site/api/create"
  
  // For local development, uncomment the line below and comment the line above:
  // const API_URL = "http://localhost:3001/api/create"
  // Note: Also add "http://localhost:*" to host_permissions in manifest.json for local development

  // Event listeners
  passwordToggle.addEventListener("change", function () {
    passwordFields.classList.toggle("hidden", !this.checked)
    if (!this.checked) {
      passwordInput.value = ""
    }
  })

  if (togglePasswordBtn && eyeIcon && eyeOffIcon) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)
      eyeIcon.classList.toggle("hidden")
      eyeOffIcon.classList.toggle("hidden")
    })
  }

  createButton.addEventListener("click", createSnippet)
  
  if (copyUrlButton) {
    copyUrlButton.addEventListener("click", copyToClipboard)
  }
  
  createNewButton.addEventListener("click", resetForm)
  
  if (tryAgainButton) {
    tryAgainButton.addEventListener("click", () => {
      errorSection.classList.add("hidden")
      createForm.classList.remove("hidden")
    })
  }

  // Owner code copy functionality
  if (copyOwnerCodeButton) {
    copyOwnerCodeButton.addEventListener("click", copyOwnerCodeToClipboard)
  }
  
  // Clear recent snippet functionality
  if (clearRecentButton) {
    clearRecentButton.addEventListener("click", clearRecentSnippet)
  }

  // Safely attempt to check for selected text
  tryGetSelectedText()
  
  // Check for recently created snippet
  checkForRecentSnippet()

  // Function to safely attempt to get selected text
  function tryGetSelectedText() {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0] || !tabs[0].id) {
          console.log("No valid tab found")
          return
        }

        // Check if we can inject a content script in this tab
        const url = tabs[0].url || ""
        if (
          url.startsWith("chrome://") ||
          url.startsWith("edge://") ||
          url.startsWith("about:") ||
          url.startsWith("chrome-extension://")
        ) {
          console.log("Cannot access content in this tab:", url)
          return
        }

        // Attempt to send a message to the content script
        // We wrap this in a try-catch to handle the case where runtime.lastError occurs
        try {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, (response) => {
            // Check for runtime.lastError to avoid unhandled error message
            if (chrome.runtime.lastError) {
              console.log("Content script connection error:", chrome.runtime.lastError.message)
              return
            }

            if (response && response.selectedText) {
              contentInput.value = response.selectedText
              // Try to detect language based on the file extension or content
              detectLanguage(tabs[0].url, response.selectedText)
            }
          })
        } catch (err) {
          console.log("Error sending message to content script:", err)
        }
      })
    } catch (err) {
      console.log("Error querying tabs:", err)
    }
  }

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
        console.log("Attempting direct API call to:", API_URL)
        console.log("Payload:", payload)
        
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        console.log("Response status:", response.status)
        console.log("Response headers:", response.headers)
        
        if (!response.ok) {
          console.log("Response not OK, status:", response.status)
          const errorText = await response.text()
          console.log("Error response text:", errorText)
          try {
            const errorData = JSON.parse(errorText)
            throw new Error(errorData.message || `API error: ${response.status}`)
          } catch (parseError) {
            throw new Error(`API error ${response.status}: ${errorText}`)
          }
        }

        const responseText = await response.text()
        console.log("Raw response text:", responseText)
        
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError)
          throw new Error("Invalid JSON response from server")
        }
        
        // Debug logging
        console.log("Direct API call successful, parsed data:", data)
        console.log("Response data keys:", Object.keys(data))
        console.log("shortId:", data.shortId)
        console.log("ownerCode:", data.ownerCode)
      } catch (directApiError) {
        // If direct API call fails, try using the background script
        console.log("Direct API call failed, trying via background script:", directApiError)
        console.log("Will use background script with payload:", payload)

        data = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(
            {
              action: "createSnippet",
              url: API_URL,
              data: payload,
            },
            (response) => {
              console.log("Background script response:", response)
              
              if (chrome.runtime.lastError) {
                console.log("Chrome runtime error:", chrome.runtime.lastError.message)
                reject(new Error(chrome.runtime.lastError.message))
                return
              }

              if (response && response.success) {
                console.log("Background script success, data:", response.data)
                resolve(response.data)
              } else {
                console.log("Background script failed:", response?.error)
                reject(new Error(response?.error || "Failed to create snippet via background"))
              }
            },
          )
        })
        
        console.log("Data from background script:", data)
      }

      // Check if the API call was successful
      if (!data.success) {
        throw new Error(data.message || "Failed to create snippet")
      }
      
      // Debug logging for final response
      console.log("Final API response:", data)
      console.log("Success status:", data.success)

      // Get the snippet ID and owner code from the response
      // Handle both new flat format and older nested format
      let snippetId, ownerCode;
      
      if (data.shortId && typeof data.shortId === 'object') {
        // Older nested format: { success: true, shortId: { shortId: "...", ownerCode: "..." } }
        snippetId = data.shortId.shortId;
        ownerCode = data.shortId.ownerCode;
        console.log("Using nested response format");
      } else {
        // New flat format: { success: true, shortId: "...", ownerCode: "..." }
        snippetId = data.shortId;
        ownerCode = data.ownerCode;
        console.log("Using flat response format");
      }
      
      console.log("Extracted snippetId:", snippetId)
      console.log("Extracted ownerCode:", ownerCode)
      
      if (!snippetId) {
        throw new Error("Invalid response from server: missing snippet ID")
      }
      if (!ownerCode) {
        throw new Error("Invalid response from server: missing owner code")
      }

      // Generate the snippet URL
      const snippetUrl = `https://codin.site/${snippetId}`

      // Show result
      loadingSection.classList.add("hidden")
      resultSection.classList.remove("hidden")
      snippetUrlInput.value = snippetUrl
      ownerCodeInput.value = ownerCode

      // Show password notice if applicable
      passwordNotice.classList.toggle("hidden", !isPasswordProtected)

      // Save to local storage for history (including owner code for quick access)
      const snippetData = {
        id: snippetId,
        title: title || "Untitled Snippet",
        language,
        createdAt: new Date().toISOString(),
        url: snippetUrl,
        ownerCode: ownerCode,
        isPasswordProtected,
      };
      
      saveToHistory(snippetData)
      
      // Also save as the "last created snippet" for quick access
      saveLastCreatedSnippet(snippetData)
    } catch (error) {
      console.error("Error creating snippet:", error)
      loadingSection.classList.add("hidden")
      errorSection.classList.remove("hidden")
      errorMessage.textContent = error.message || "Failed to create snippet. Please try again."
    }
  }

  // Function to copy URL to clipboard
  function copyToClipboard() {
    if (!snippetUrlInput || !copyIcon || !checkIcon) {
      console.error("Copy URL elements not found")
      return
    }
    
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
        // Fallback to execCommand for older browsers
        document.execCommand("copy")

        // Show success state
        copyIcon.classList.add("hidden")
        checkIcon.classList.remove("hidden")

        // Reset after 2 seconds
        setTimeout(() => {
          copyIcon.classList.remove("hidden")
          checkIcon.classList.add("hidden")
        }, 2000)
      })
  }

  // Function to copy owner code to clipboard
  function copyOwnerCodeToClipboard() {
    if (!ownerCodeInput || !copyOwnerIcon || !checkOwnerIcon) {
      console.error("Copy owner code elements not found")
      return
    }
    
    ownerCodeInput.select()
    navigator.clipboard
      .writeText(ownerCodeInput.value)
      .then(() => {
        // Show success state
        copyOwnerIcon.classList.add("hidden")
        checkOwnerIcon.classList.remove("hidden")

        // Reset after 2 seconds
        setTimeout(() => {
          copyOwnerIcon.classList.remove("hidden")
          checkOwnerIcon.classList.add("hidden")
        }, 2000)
      })
      .catch((err) => {
        console.error("Failed to copy owner code: ", err)
        // Fallback to execCommand for older browsers
        document.execCommand("copy")

        // Show success state
        copyOwnerIcon.classList.add("hidden")
        checkOwnerIcon.classList.remove("hidden")

        // Reset after 2 seconds
        setTimeout(() => {
          copyOwnerIcon.classList.remove("hidden")
          checkOwnerIcon.classList.add("hidden")
        }, 2000)
      })
  }

  // Function to reset the form
  function resetForm() {
    if (titleInput) titleInput.value = ""
    if (contentInput) contentInput.value = ""
    if (languageSelect) languageSelect.value = "plaintext"
    if (expirationSelect) expirationSelect.value = "1d"
    if (viewLimitSelect) viewLimitSelect.value = "unlimited"
    if (passwordToggle) passwordToggle.checked = false
    if (passwordFields) passwordFields.classList.add("hidden")
    if (passwordInput) passwordInput.value = ""
    if (ownerCodeInput) ownerCodeInput.value = ""

    if (resultSection) {
      resultSection.classList.add("hidden")
      resultSection.classList.remove("recent-snippet")
    }
    
    if (clearRecentButton) {
      clearRecentButton.classList.add("hidden")
    }
    
    if (createForm) {
      createForm.classList.remove("hidden")
    }
    
    // Reset the result title
    if (resultSection) {
      const resultTitle = resultSection.querySelector("h3")
      if (resultTitle) {
        resultTitle.textContent = "Snippet Created!"
      }
    }
    
    // Reset create new button text
    if (createNewButton) {
      createNewButton.textContent = "Create Another Snippet"
    }
  }

  // Function to show error
  function showError(message) {
    createForm.classList.add("hidden")
    errorSection.classList.remove("hidden")
    errorMessage.textContent = message
  }

  // Function to save snippet to history
  function saveToHistory(snippet) {
    try {
      chrome.storage.local.get(["snippetHistory"], (result) => {
        if (chrome.runtime.lastError) {
          console.error("Error accessing storage:", chrome.runtime.lastError)
          return
        }

        const history = result.snippetHistory || []
        history.unshift(snippet)

        // Keep only the last 50 snippets
        if (history.length > 50) {
          history.pop()
        }

        chrome.storage.local.set({ snippetHistory: history }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving to storage:", chrome.runtime.lastError)
          }
        })
      })
    } catch (err) {
      console.error("Error in saveToHistory:", err)
    }
  }

  // Function to save last created snippet
  function saveLastCreatedSnippet(snippet) {
    try {
      chrome.storage.local.set({ lastCreatedSnippet: snippet }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving last created snippet:", chrome.runtime.lastError)
        }
      })
    } catch (err) {
      console.error("Error in saveLastCreatedSnippet:", err)
    }
  }

  // Check for recently created snippet
  function checkForRecentSnippet() {
    chrome.storage.local.get(["lastCreatedSnippet"], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error accessing storage:", chrome.runtime.lastError)
        return
      }

      if (result.lastCreatedSnippet) {
        const snippet = result.lastCreatedSnippet
        
        // Check if snippet was created recently (within last 5 minutes)
        const createdTime = new Date(snippet.createdAt)
        const now = new Date()
        const timeDiff = (now - createdTime) / (1000 * 60) // difference in minutes
        
        if (timeDiff <= 5) {
          // Show the recent snippet result
          if (createForm && resultSection) {
            createForm.classList.add("hidden")
            resultSection.classList.remove("hidden")
            resultSection.classList.add("recent-snippet")
          }
          
          if (snippetUrlInput && snippet.url) {
            snippetUrlInput.value = snippet.url
          }
          
          if (ownerCodeInput && snippet.ownerCode) {
            ownerCodeInput.value = snippet.ownerCode
          }
          
          if (passwordNotice) {
            passwordNotice.classList.toggle("hidden", !snippet.isPasswordProtected)
          }
          
          // Update the header text to indicate this is a recent snippet
          if (resultSection) {
            const resultTitle = resultSection.querySelector("h3")
            if (resultTitle) {
              resultTitle.textContent = "Recent Snippet"
            }
          }
          
          // Show clear recent button and update create new button text
          if (clearRecentButton) {
            clearRecentButton.classList.remove("hidden")
          }
          
          if (createNewButton) {
            createNewButton.textContent = "Create New Snippet"
          }
          
          console.log("Showing recent snippet:", snippet.id)
        }
      }
    })
  }

  // Function to clear recent snippet
  function clearRecentSnippet() {
    console.log("Clear recent snippet clicked")
    
    try {
      chrome.storage.local.remove(["lastCreatedSnippet"], () => {
        if (chrome.runtime.lastError) {
          console.error("Error clearing recent snippet:", chrome.runtime.lastError)
        } else {
          console.log("Recent snippet cleared from storage")
        }
        
        // Always reset the form, even if storage operation fails
        resetForm()
      })
    } catch (err) {
      console.error("Error in clearRecentSnippet:", err)
      // Still reset the form even if storage fails
      resetForm()
    }
  }
})
