async function updateUI() {
  const { enabled } = await browser.storage.local.get('enabled');
  const btn = document.getElementById('toggle-btn');
  const debug = document.getElementById('debug');
  if (enabled === false) {
    btn.textContent = "Turn ON";
    btn.style.background = "#e74c3c";
    debug.textContent = "Redirector is OFF";
  } else {
    btn.textContent = "Turn OFF";
    btn.style.background = "#2ecc40";
    debug.textContent = "Redirector is ON";
  }
  console.log("[popup] Current enabled state:", enabled);
}

document.addEventListener('DOMContentLoaded', async () => {
  const btn = document.getElementById('toggle-btn');
  await updateUI();

  btn.onclick = async () => {
    const { enabled } = await browser.storage.local.get('enabled');
    const newState = !(enabled !== false); // default true if undefined
    await browser.storage.local.set({ enabled: newState });
    console.log("[popup] Set enabled to:", newState);
    await updateUI();
  };
});