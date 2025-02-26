// Active by default
let isActive = true;

// Determine the replacement word based on the webpage's language
const isPortuguese = document.documentElement.lang.startsWith("pt");
const replacement1 = isPortuguese ? "Laranja Irritante" : "Annoying Orange";
const replacement2 = isPortuguese ? "Kiko dos Foguetes" : "Phony Stark";
const replacement2b = isPortuguese ? "Kiko" : "Phony";

const replacements = {
    "Donald Trump": replacement1,
    "Trump": replacement1,
    "Elon Musk": replacement2,
    "Musk": replacement2,
    "Elon": replacement2b,
    "Jeff Bezos": "Bald Guy Kazoo",
    "Bezos": "Bald Guy",
    "Mark Zuckerberg": "Fart Chuckleberg",
    "Zuckerberg": "Chuckleberg",
};

// Function to replace text in a node
function replaceText(node) {
    // Iterate over all text nodes in the document
    if (node.nodeType === Node.TEXT_NODE) {
        for (const [search, replace] of Object.entries(replacements)) {
            node.textContent = node.textContent.replace(new RegExp(search, "gi"), replace);
        }
    } else {
        // Recursively process child nodes
        node.childNodes.forEach(replaceText);
    }
}

function processDocument() {
    if (isActive) {
        replaceText(document.body);
    }
}

chrome.storage.local.get(["isActive"], (result) => {
    isActive = result.isActive !== false; // Default to true if not set
    chrome.storage.local.set({ isActive }, () => {}); // Save the new state
    processDocument();
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "activate") {
        isActive = true;
        processDocument(); // Re-run replacement if activated
    } else if (message.action === "deactivate") {
        isActive = false;
        // reload?
    }
});

// Observe dynamic changes to the DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(replaceText);
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});