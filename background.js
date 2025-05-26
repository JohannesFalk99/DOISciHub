// DOI Redirector Background Script
// Listens for requests to any URL and redirects to sci-hub.se if a DOI is detected and enabled

const CONTEXT_MENU_ID = "toggle-enabled";

// Always recreate the context menu to avoid duplicates or missing menu
async function refreshContextMenu() {
  const { enabled } = await browser.storage.local.get('enabled');
  await browser.contextMenus.removeAll();
  await browser.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Enable Extension",
    type: "checkbox",
    checked: enabled !== false,
    contexts: ["browser_action"]
  });
  console.log("[refreshContextMenu] Context menu created, checked:", enabled !== false);
}

// On install or startup, ensure context menu matches storage
browser.runtime.onInstalled.addListener(refreshContextMenu);
browser.runtime.onStartup.addListener(refreshContextMenu);

// Handle context menu toggle
browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    console.log("[contextMenus.onClicked] Set enabled to:", info.checked);
    browser.storage.local.set({ enabled: info.checked });
  }
});

// Listen for storage changes and update context menu checkbox
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    console.log("[storage.onChanged] enabled changed to:", changes.enabled.newValue);
    refreshContextMenu();
  }
});

browser.webRequest.onBeforeRequest.addListener(
  async function(details) {
    const { enabled } = await browser.storage.local.get('enabled');
    console.log("[onBeforeRequest] enabled is:", enabled);
    if (enabled === false) {
      console.log("[onBeforeRequest] Redirector is disabled, skipping.");
      return {};
    }

    const originalUrl = details.url;

    // Skip requests to Sci-Hub domains
    if (/:\/\/(?:[^\/]+\.)?sci-hub\.[^\/]+/i.test(originalUrl)) {
      console.log(`[onBeforeRequest] Skipping Sci-Hub URL: ${originalUrl}`);
      return {};
    }

    // Decode the URL to normalize encoded characters
    const decodedUrl = decodeURIComponent(originalUrl);

    // Robust DOI matcher (Crossref-compliant)
    const doiRegex = /10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i;
    const doiMatch = decodedUrl.match(doiRegex);

    if (doiMatch) {
      const doi = doiMatch[0];
      const newUrl = "https://sci-hub.se/" + doi;
      console.log(`[onBeforeRequest] Redirecting ${originalUrl} to ${newUrl}`);
      return { redirectUrl: newUrl };
    } else {
      console.log(`[onBeforeRequest] No valid DOI found in URL: ${originalUrl}`);
      return {};
    }
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame"]
  },
  ["blocking"]
);

console.log("DOI Redirector extension initialized");