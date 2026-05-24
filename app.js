document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startAimbot');
  const stopButton = document.getElementById('stopAimbot');
  const toggleButton = document.getElementById('toggleExtendedPixel');
  const status = document.getElementById('bridgeStatus');
  const hostInfo = document.getElementById('hostInfo');
  const origin = window.location.origin;

  hostInfo.textContent = origin;

  function updateStatus() {
    if (window.AndroidAimbotBridge) {
      status.textContent = 'Status: AndroidAimbotBridge disponível';
      status.classList.remove('status-error');
      status.classList.add('status-ok');
    } else {
      status.textContent = 'Status: AndroidAimbotBridge NÃO encontrado';
      status.classList.remove('status-ok');
      status.classList.add('status-error');
    }
  }

  startButton.addEventListener('click', () => {
    if (window.AndroidAimbotBridge && AndroidAimbotBridge.startAimbot) {
      AndroidAimbotBridge.startAimbot();
      status.textContent = 'Status: ✅ Aimbot v3 iniciado (Pixel Estendido)';
      status.classList.remove('status-error');
      status.classList.add('status-ok');
    } else {
      status.textContent = 'Status: AndroidAimbotBridge não disponível';
      status.classList.remove('status-ok');
      status.classList.add('status-error');
    }
  });

  stopButton.addEventListener('click', () => {
    if (window.AndroidAimbotBridge && AndroidAimbotBridge.stopAimbot) {
      AndroidAimbotBridge.stopAimbot();
      status.textContent = 'Status: ❌ Aimbot parado';
      status.classList.remove('status-error');
      status.classList.add('status-ok');
    } else {
      status.textContent = 'Status: AndroidAimbotBridge não disponível';
      status.classList.remove('status-ok');
      status.classList.add('status-error');
    }
  });

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      if (window.AndroidAimbotBridge && AndroidAimbotBridge.toggleExtendedPixel) {
        const result = AndroidAimbotBridge.toggleExtendedPixel();
        status.textContent = `Status: ${result}`;
        status.classList.remove('status-error');
        status.classList.add('status-ok');
      }
    });
  }

  document.getElementById('refreshStatus').addEventListener('click', updateStatus);

  updateStatus();
});