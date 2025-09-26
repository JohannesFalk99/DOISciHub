async function getSettings() {
  const defaults = {
    enabled: true,
    downloadPdf: false,
    downloadSubdir: "SciHubDownloads",
  };
  return Object.assign(defaults, await browser.storage.local.get(Object.keys(defaults)));
}

function isSciHubUrl(url) {
  return /sci-hub\.[^\/]+/i.test(url);
}

function extractIdentifier(url) {
  const decoded = decodeURIComponent(url);
  const doiRegex = /10\.\d{4,9}\/[\-._;()/:A-Z0-9]+/i;
  const sdRegex = /^https?:\/\/www\.sciencedirect\.com\/science\/article\/abs\/pii\/[A-Z0-9]+$/i;
  const acsRegex = /^https:\/\/pubs\.acs\.org\/doi\/(abs|pdf|full)\/10\.\d{4,9}\/[\w.+-]+$/i;

  if (sdRegex.test(decoded) || acsRegex.test(decoded)) return decoded;

  const match = decoded.match(doiRegex);
  return match ? match[0] : null;
}

function sciHubHasArticle(html) {
  return !html.includes("doesn't have the requested document") && 
         !html.includes('<p id = "smile">:(</p>');
}

function extractPdfUrl(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const embed = doc.querySelector("#article embed");
  
  if (!embed) return null;

  let src = embed.getAttribute("src") || "";
  if (src.startsWith("//")) {
    src = "https:" + src;
  } else if (src.startsWith("/")) {
    src = "https://sci-hub.se" + src;
  }

  return /^https?:\/\//i.test(src) ? src : null;
}

async function onBeforeRequestHandler(details) {
  const { enabled, downloadPdf, downloadSubdir } = await getSettings();
  
  if (!enabled || isSciHubUrl(details.url)) {
    return {};
  }

  const identifier = extractIdentifier(details.url);
  if (!identifier) {
    return {};
  }

  try {
    const sciHubUrl = `https://sci-hub.se/${identifier}`;
    const response = await fetch(sciHubUrl);
    const html = await response.text();
    
    if (!sciHubHasArticle(html)) {
      browser.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Sci-hub redirector - No Article Found",
        message: "Article detected, but not available on Sci-Hub. It may be open access."
      });
      return {};
    }

    const pdfUrl = extractPdfUrl(html);
    if (!pdfUrl) {
      return { redirectUrl: sciHubUrl };
    }

    if (downloadPdf) {
      const doiPart = identifier.match(/10\.\d{4,9}\/[\-._;()/:A-Z0-9]+/i);
      const filename = (doiPart ? doiPart[0] : "article").replace(/\//g, "_") + ".pdf";
      const downloadDir = (downloadSubdir || "SciHubDownloads").trim();

      browser.downloads.download({
        url: pdfUrl,
        filename: `${downloadDir}/${filename}`,
        saveAs: false,
      });
    }

    return { redirectUrl: pdfUrl };
  } catch (error) {
    console.error("Sci-Hub request failed:", error);
    return {};
  }
}

browser.webRequest.onBeforeRequest.addListener(
  onBeforeRequestHandler,
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
);
