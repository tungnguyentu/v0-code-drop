// This is a fallback approach that will be used if the API calls fail
// It creates an iframe with the Codin form and submits it programmatically

function createSnippetViaForm(snippetData) {
  return new Promise((resolve, reject) => {
    try {
      // Create an invisible iframe to load the Codin site
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      document.body.appendChild(iframe)

      // Set up a listener for when the iframe loads
      iframe.onload = async () => {
        try {
          // Get the iframe document
          const iframeDoc = iframe.contentWindow.document

          // Fill in the form fields
          const titleInput = iframeDoc.querySelector("#title")
          const contentInput = iframeDoc.querySelector("#content")
          const languageSelect = iframeDoc.querySelector("#language")
          const expirationSelect = iframeDoc.querySelector("#expiration")
          const viewLimitSelect = iframeDoc.querySelector("#viewLimit")

          if (titleInput) titleInput.value = snippetData.title || ""
          if (contentInput) contentInput.value = snippetData.content
          if (languageSelect) languageSelect.value = snippetData.language
          if (expirationSelect) expirationSelect.value = snippetData.expiration
          if (viewLimitSelect) viewLimitSelect.value = snippetData.viewLimit

          // Handle password protection if needed
          if (snippetData.password) {
            const passwordToggle = iframeDoc.querySelector("#password-toggle")
            const passwordInput = iframeDoc.querySelector("#password")

            if (passwordToggle) passwordToggle.checked = true
            if (passwordInput) passwordInput.value = snippetData.password
          }

          // Submit the form
          const form = iframeDoc.querySelector("form")
          if (form) {
            form.submit()

            // Wait for the result page to load
            setTimeout(() => {
              // Try to get the snippet URL from the result page
              const snippetUrlInput = iframeDoc.querySelector("#snippet-url")
              if (snippetUrlInput && snippetUrlInput.value) {
                resolve({
                  success: true,
                  shortId: snippetUrlInput.value.split("/").pop(),
                  url: snippetUrlInput.value,
                })
              } else {
                reject(new Error("Could not retrieve snippet URL"))
              }

              // Clean up
              document.body.removeChild(iframe)
            }, 3000) // Wait 3 seconds for the form to submit and result to load
          } else {
            reject(new Error("Form not found in Codin page"))
            document.body.removeChild(iframe)
          }
        } catch (error) {
          reject(error)
          document.body.removeChild(iframe)
        }
      }

      // Load the Codin site in the iframe
      iframe.src = "https://codin.site/"
    } catch (error) {
      reject(error)
    }
  })
}

// Export the function for use in popup.js
window.createSnippetViaForm = createSnippetViaForm
