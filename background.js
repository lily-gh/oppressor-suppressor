// Function to update the icon and title
function updateIcon(isActive) {
    const iconPath = isActive ? "icon.png" : "icon-grey.png";
    const title = isActive ? "Oppressor Suppressor" : "Oppressor Suppressor (Inactive)";

    chrome.action.setIcon({ path: iconPath });
    chrome.action.setTitle({ title });
}

// Toggle the global activation state
chrome.action.onClicked.addListener((tab) => {
    const tabId = tab.id;

    chrome.storage.local.get(["isActive"], (result) => {
        const isActive = !result.isActive;

        // Save the new state to storage
        chrome.storage.local.set({ isActive }, () => {
            updateIcon(isActive);

            // Send a message to all tabs to update their state
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.sendMessage(tab.id, { action: isActive ? "activate" : "deactivate" });

                    // Reload the current tab if deactivating
                    if (!isActive) {
                        chrome.tabs.reload(tabId);
                    }
                });
            });
        });
    });
});

// Initialize the icon and state when the extension is loaded
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["isActive"], (result) => {
        const isActive = result.isActive !== false; // Default to true if not set
        updateIcon(isActive);
    });
});