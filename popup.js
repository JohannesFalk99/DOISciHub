async function updateUI() {
  const { enabled = true, downloadPdf, downloadSubdir } = await browser.storage.local.get(['enabled', 'downloadPdf', 'downloadSubdir']);
  const toggleBtn = document.getElementById('toggle-btn');
  const pdfCheckbox = document.getElementById('pdf-checkbox');
  const subdirInput = document.getElementById('subdir-input');
  const debug = document.getElementById('debug');

  if (enabled === false) {
    toggleBtn.textContent = "Turn ON";
    debug.textContent = "Redirector is OFF";
  } else {
    toggleBtn.textContent = "Turn OFF";
    debug.textContent = "Redirector is ON";
  }

  pdfCheckbox.checked = !!downloadPdf;
  subdirInput.value = (typeof downloadSubdir === "string" && downloadSubdir.trim()) ? downloadSubdir : "SciHubDownloads";

  console.log("[popup] Current enabled state:", enabled);
  console.log("[popup] Current downloadPdf state:", downloadPdf);
}

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const pdfCheckbox = document.getElementById('pdf-checkbox');
  const subdirInput = document.getElementById('subdir-input');

  await updateUI();

  toggleBtn.onclick = async () => {
    const { enabled } = await browser.storage.local.get('enabled');
    const newState = !(enabled !== false); // default true if undefined
    await browser.storage.local.set({ enabled: newState });
    console.log("[popup] Set enabled to:", newState);
    await updateUI();
  };

  pdfCheckbox.onchange = async (event) => {
    const newState = event.target.checked;
    await browser.storage.local.set({ downloadPdf: newState });
    console.log("[popup] Set downloadPdf to:", newState);
  };

  subdirInput.onchange = async (event) => {
    const newSubdir = event.target.value.trim();
    await browser.storage.local.set({ downloadSubdir: newSubdir });
    console.log("[popup] Set downloadSubdir to:", newSubdir);
  };
});