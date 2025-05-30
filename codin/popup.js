document.addEventListener("DOMContentLoaded", () => {
  // DOM elements - Navigation
  const createTab = document.getElementById("create-tab")
  const manageTab = document.getElementById("manage-tab")
  
  // DOM elements - Sections
  const createForm = document.getElementById("create-form")
  const manageSection = document.getElementById("manage-section")
  const editForm = document.getElementById("edit-form")
  const resultSection = document.getElementById("result")
  const loadingSection = document.getElementById("loading")
  const errorSection = document.getElementById("error")
  const statusMessage = document.getElementById("status-message")
  const deleteModal = document.getElementById("delete-modal")

  // DOM elements - Create form
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

  // DOM elements - Manage form
  const snippetUrlInput = document.getElementById("snippet-url")
  const ownerCodeInput = document.getElementById("owner-code")
  const editBtn = document.getElementById("edit-btn")
  const deleteBtn = document.getElementById("delete-btn")
  const viewBtn = document.getElementById("view-btn")

  // DOM elements - Edit form
  const editTitleInput = document.getElementById("edit-title")
  const editContentInput = document.getElementById("edit-content")
  const editLanguageSelect = document.getElementById("edit-language")
  const editExpirationSelect = document.getElementById("edit-expiration")
  const editViewLimitSelect = document.getElementById("edit-view-limit")
  const saveEditBtn = document.getElementById("save-edit-btn")
  const cancelEditBtn = document.getElementById("cancel-edit-btn")
  const backToManageBtn = document.getElementById("back-to-manage")

  // DOM elements - Result and status
  const snippetUrlResult = document.getElementById("snippet-url-result")
  const ownerCodeResult = document.getElementById("owner-code-result")
  const copyUrlButton = document.getElementById("copy-url")
  const copyOwnerCodeButton = document.getElementById("copy-owner-code")
  const copyIcon = document.getElementById("copy-icon")
  const checkIcon = document.getElementById("check-icon")
  const copyOwnerIcon = document.getElementById("copy-owner-icon")
  const checkOwnerIcon = document.getElementById("check-owner-icon")
  const passwordNotice = document.getElementById("password-notice")
  const createNewButton = document.getElementById("create-new")
  const tryAgainButton = document.getElementById("try-again")
  const loadingText = document.getElementById("loading-text")
  const errorMessage = document.getElementById("error-message")

  // DOM elements - Status and modals
  const statusTitle = document.getElementById("status-title")
  const statusText = document.getElementById("status-text")
  const statusOkBtn = document.getElementById("status-ok-btn")
  const statusSuccessIcon = document.getElementById("status-success-icon")
  const statusErrorIcon = document.getElementById("status-error-icon")
  const confirmDeleteBtn = document.getElementById("confirm-delete")
  const cancelDeleteBtn = document.getElementById("cancel-delete")

  // API URLs
  const API_BASE = "https://codin.site"
  const API_CREATE = `${API_BASE}/api/create`
  const API_VERIFY_OWNER = `${API_BASE}/api/verify-owner`
  const API_GET_FOR_EDIT = `${API_BASE}/api/get-for-edit`
  const API_UPDATE_SNIPPET = `${API_BASE}/api/update-snippet`
  const API_DELETE_SNIPPET = `${API_BASE}/api/delete-snippet`

  // State management
  let currentSnippetId = null
  let currentOwnerCode = null
  let currentSnippetData = null

  // Initialize the extension
  init()

  function init() {
    setupEventListeners()
    tryGetSelectedText()
    showSection('create')
  }

  function setupEventListeners() {
    // Navigation tabs
    createTab.addEventListener("click", () => switchTab('create'))
    manageTab.addEventListener("click", () => switchTab('manage'))

    // Create form
    passwordToggle.addEventListener("change", togglePasswordFields)
    togglePasswordBtn.addEventListener("click", togglePasswordVisibility)
    createButton.addEventListener("click", createSnippet)

    // Manage form
    editBtn.addEventListener("click", handleEdit)
    deleteBtn.addEventListener("click", handleDelete)
    viewBtn.addEventListener("click", handleView)

    // Edit form
    saveEditBtn.addEventListener("click", handleSaveEdit)
    cancelEditBtn.addEventListener("click", () => showSection('manage'))
    backToManageBtn.addEventListener("click", () => showSection('manage'))

    // Result actions
    copyUrlButton.addEventListener("click", () => copyToClipboard(snippetUrlResult, copyIcon, checkIcon))
    copyOwnerCodeButton.addEventListener("click", () => copyToClipboard(ownerCodeResult, copyOwnerIcon, checkOwnerIcon))
    createNewButton.addEventListener("click", resetCreateForm)
    tryAgainButton.addEventListener("click", handleTryAgain)

    // Status and modals
    statusOkBtn.addEventListener("click", hideStatusMessage)
    confirmDeleteBtn.addEventListener("click", handleConfirmDelete)
    cancelDeleteBtn.addEventListener("click", hideDeleteModal)

    // Input validation
    ownerCodeInput.addEventListener("input", formatOwnerCode)
  }

  function switchTab(tab) {
    createTab.classList.toggle('active', tab === 'create')
    manageTab.classList.toggle('active', tab === 'manage')
    
    if (tab === 'create') {
      showSection('create')
    } else {
      showSection('manage')
    }
  }

  function showSection(section) {
    // Hide all sections
    createForm.classList.add('hidden')
    manageSection.classList.add('hidden')
    editForm.classList.add('hidden')
    resultSection.classList.add('hidden')
    loadingSection.classList.add('hidden')
    errorSection.classList.add('hidden')

    // Show requested section
    if (section === 'create') {
      createForm.classList.remove('hidden')
    } else if (section === 'manage') {
      manageSection.classList.remove('hidden')
    } else if (section === 'edit') {
      editForm.classList.remove('hidden')
    } else if (section === 'result') {
      resultSection.classList.remove('hidden')
    } else if (section === 'loading') {
      loadingSection.classList.remove('hidden')
    } else if (section === 'error') {
      errorSection.classList.remove('hidden')
    }
  }

  function togglePasswordFields() {
    passwordFields.classList.toggle("hidden", !passwordToggle.checked)
    if (!passwordToggle.checked) {
      passwordInput.value = ""
    }
  }

  function togglePasswordVisibility() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)
    eyeIcon.classList.toggle("hidden")
    eyeOffIcon.classList.toggle("hidden")
  }

  function formatOwnerCode() {
    let value = ownerCodeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    // Add OWN- prefix if not present
    if (value && !value.startsWith('OWN-')) {
      if (value.startsWith('OWN')) {
        value = 'OWN-' + value.substring(3)
      } else {
        value = 'OWN-' + value
      }
    }
    
    // Limit to 16 characters total
    if (value.length > 16) {
      value = value.substring(0, 16)
    }
    
    ownerCodeInput.value = value
  }

  function extractSnippetId(urlOrId) {
    if (!urlOrId) return null
    
    const trimmed = urlOrId.trim()
    
    // If it's a URL, extract the ID
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/')
      return parts[parts.length - 1]
    }
    
    // If it's just an ID
    return trimmed
  }

  function validateInputs(snippetId, ownerCode) {
    if (!snippetId) {
      showStatusMessage('Error', 'Please enter a valid snippet URL or ID', 'error')
      return false
    }
    
    if (!ownerCode || ownerCode.length < 16) {
      showStatusMessage('Error', 'Please enter a valid owner code (OWN-ABC123DEF456)', 'error')
      return false
    }
    
    return true
  }

  async function handleEdit() {
    const snippetId = extractSnippetId(snippetUrlInput.value)
    const ownerCode = ownerCodeInput.value.trim()
    
    if (!validateInputs(snippetId, ownerCode)) {
      return
    }

    showSection('loading')
    loadingText.textContent = 'Loading snippet...'

    try {
      const response = await makeApiCall(API_GET_FOR_EDIT, {
        snippetId,
        ownerCode
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to load snippet')
      }

      currentSnippetId = snippetId
      currentOwnerCode = ownerCode
      currentSnippetData = response.snippet

      populateEditForm(response.snippet)
      showSection('edit')
    } catch (error) {
      console.error('Error loading snippet for edit:', error)
      showSection('error')
      errorMessage.textContent = error.message || 'Failed to load snippet for editing'
    }
  }

  async function handleDelete() {
    const snippetId = extractSnippetId(snippetUrlInput.value)
    const ownerCode = ownerCodeInput.value.trim()
    
    if (!validateInputs(snippetId, ownerCode)) {
      return
    }

    currentSnippetId = snippetId
    currentOwnerCode = ownerCode
    showDeleteModal()
  }

  async function handleView() {
    const snippetId = extractSnippetId(snippetUrlInput.value)
    
    if (!snippetId) {
      showStatusMessage('Error', 'Please enter a valid snippet URL or ID', 'error')
      return
    }

    const url = `${API_BASE}/${snippetId}`
    chrome.tabs.create({ url })
  }

  async function handleConfirmDelete() {
    hideDeleteModal()
    showSection('loading')
    loadingText.textContent = 'Deleting snippet...'

    try {
      const response = await makeApiCall(API_DELETE_SNIPPET, {
        snippetId: currentSnippetId,
        ownerCode: currentOwnerCode
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete snippet')
      }

      showStatusMessage('Success', 'Snippet deleted successfully', 'success')
      
      // Clear the manage form
      snippetUrlInput.value = ''
      ownerCodeInput.value = ''
      
      setTimeout(() => {
        hideStatusMessage()
        showSection('manage')
      }, 2000)
    } catch (error) {
      console.error('Error deleting snippet:', error)
      showSection('error')
      errorMessage.textContent = error.message || 'Failed to delete snippet'
    }
  }

  function populateEditForm(snippet) {
    editTitleInput.value = snippet.title || ''
    editContentInput.value = snippet.content || ''
    editLanguageSelect.value = snippet.language || 'plaintext'
    
    // Convert expiry date to option
    let expiryOption = 'never'
    if (snippet.expiresAt) {
      const expiryDate = new Date(snippet.expiresAt)
      const now = new Date()
      const diffHours = Math.round((expiryDate - now) / (1000 * 60 * 60))
      
      if (diffHours <= 1) expiryOption = '1h'
      else if (diffHours <= 24) expiryOption = '1d'
      else if (diffHours <= 168) expiryOption = '1w'
    }
    editExpirationSelect.value = expiryOption
    
    editViewLimitSelect.value = snippet.viewLimit || 'unlimited'
  }

  async function handleSaveEdit() {
    showSection('loading')
    loadingText.textContent = 'Saving changes...'

    try {
      const updateData = {
        title: editTitleInput.value.trim(),
        content: editContentInput.value.trim(),
        language: editLanguageSelect.value,
        expiryOption: editExpirationSelect.value,
        viewLimitOption: editViewLimitSelect.value
      }

      if (!updateData.content) {
        throw new Error('Content is required')
      }

      const response = await makeApiCall(API_UPDATE_SNIPPET, {
        snippetId: currentSnippetId,
        ownerCode: currentOwnerCode,
        ...updateData
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to update snippet')
      }

      showStatusMessage('Success', 'Snippet updated successfully', 'success')
      
      setTimeout(() => {
        hideStatusMessage()
        showSection('manage')
      }, 2000)
    } catch (error) {
      console.error('Error updating snippet:', error)
      showSection('error')
      errorMessage.textContent = error.message || 'Failed to update snippet'
    }
  }

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
      showStatusMessage('Error', 'Content is required', 'error')
      return
    }

    // Validate password if protection is enabled
    if (isPasswordProtected && !password) {
      showStatusMessage('Error', 'Password is required when protection is enabled', 'error')
      return
    }

    showSection('loading')
    loadingText.textContent = 'Creating snippet...'

    try {
      const payload = {
        title: title || null,
        content: content,
        language: language,
        expiration: expiration,
        viewLimit: viewLimit,
        password: isPasswordProtected ? password : undefined,
      }

      const data = await makeApiCall(API_CREATE, payload)

      if (!data.success) {
        throw new Error(data.message || "Failed to create snippet")
      }

      const snippetId = data.shortId
      const ownerCode = data.ownerCode
      
      if (!snippetId || !ownerCode) {
        throw new Error("Invalid response from server")
      }

      const snippetUrl = `${API_BASE}/${snippetId}`

      showSection('result')
      snippetUrlResult.value = snippetUrl
      ownerCodeResult.value = ownerCode
      passwordNotice.classList.toggle("hidden", !isPasswordProtected)

      saveToHistory({
        id: snippetId,
        title: title || "Untitled Snippet",
        language,
        createdAt: new Date().toISOString(),
        url: snippetUrl,
        ownerCode: ownerCode,
        isPasswordProtected,
      })
    } catch (error) {
      console.error("Error creating snippet:", error)
      showSection('error')
      errorMessage.textContent = error.message || "Failed to create snippet. Please try again."
    }
  }

  async function makeApiCall(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok && !result.success) {
        throw new Error(result.message || `API error: ${response.status}`)
      }

      return result
    } catch (directApiError) {
      console.log("Direct API call failed, trying via background script:", directApiError)

      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            action: "makeApiCall",
            url: url,
            data: data,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message))
              return
            }

            if (response && response.success) {
              resolve(response.data)
            } else {
              reject(new Error(response?.error || "Failed to make API call via background"))
            }
          }
        )
      })
    }
  }

  function showStatusMessage(title, text, type = 'info') {
    statusTitle.textContent = title
    statusText.textContent = text
    
    statusSuccessIcon.classList.toggle('hidden', type !== 'success')
    statusErrorIcon.classList.toggle('hidden', type !== 'error')
    
    statusMessage.classList.remove('hidden')
  }

  function hideStatusMessage() {
    statusMessage.classList.add('hidden')
  }

  function showDeleteModal() {
    deleteModal.classList.remove('hidden')
  }

  function hideDeleteModal() {
    deleteModal.classList.add('hidden')
  }

  function copyToClipboard(inputElement, normalIcon, successIcon) {
    inputElement.select()
    navigator.clipboard
      .writeText(inputElement.value)
      .then(() => {
        showCopySuccess(normalIcon, successIcon)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        document.execCommand("copy")
        showCopySuccess(normalIcon, successIcon)
      })
  }

  function showCopySuccess(normalIcon, successIcon) {
    normalIcon.classList.add("hidden")
    successIcon.classList.remove("hidden")

    setTimeout(() => {
      normalIcon.classList.remove("hidden")
      successIcon.classList.add("hidden")
    }, 2000)
  }

  function resetCreateForm() {
    titleInput.value = ""
    contentInput.value = ""
    languageSelect.value = "plaintext"
    expirationSelect.value = "1d"
    viewLimitSelect.value = "unlimited"
    passwordToggle.checked = false
    passwordFields.classList.add("hidden")
    passwordInput.value = ""

    showSection('create')
    switchTab('create')
  }

  function handleTryAgain() {
    // Determine which section to return to based on current state
    if (currentSnippetData) {
      showSection('edit')
    } else if (currentSnippetId) {
      showSection('manage')
    } else {
      showSection('create')
    }
  }

  function tryGetSelectedText() {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0] || !tabs[0].id) {
          return
        }

        const url = tabs[0].url || ""
        if (
          url.startsWith("chrome://") ||
          url.startsWith("edge://") ||
          url.startsWith("about:") ||
          url.startsWith("chrome-extension://")
        ) {
          return
        }

        try {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, (response) => {
            if (chrome.runtime.lastError) {
              return
            }

            if (response && response.selectedText) {
              contentInput.value = response.selectedText
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

  function detectLanguage(url, content) {
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
      }
    }
  }

  function saveToHistory(snippet) {
    try {
      chrome.storage.local.get(["snippetHistory"], (result) => {
        if (chrome.runtime.lastError) {
          console.error("Error accessing storage:", chrome.runtime.lastError)
          return
        }

        const history = result.snippetHistory || []
        history.unshift(snippet)

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
})
