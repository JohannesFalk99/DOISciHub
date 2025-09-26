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
}

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const pdfCheckbox = document.getElementById('pdf-checkbox');
  const subdirInput = document.getElementById('subdir-input');

  await updateUI();

  toggleBtn.onclick = async () => {
    const { enabled } = await browser.storage.local.get('enabled');
    const newState = enabled !== true; // Toggle the current state
    await browser.storage.local.set({ enabled: newState });
    await updateUI();
  };

  pdfCheckbox.onchange = async (event) => {
    const newState = event.target.checked;
    await browser.storage.local.set({ downloadPdf: newState });
  };

  subdirInput.onchange = async (event) => {
    const newSubdir = event.target.value.trim();
    await browser.storage.local.set({ downloadSubdir: newSubdir });
  };
});