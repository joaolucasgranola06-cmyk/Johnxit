document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startAimbot');
  const stopButton = document.getElementById('stopAimbot');
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
      status.textContent = 'Status: Aimbot iniciado';
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
      status.textContent = 'Status: Aimbot parado';
      status.classList.remove('status-error');
      status.classList.add('status-ok');
    } else {
      status.textContent = 'Status: AndroidAimbotBridge não disponível';
      status.classList.remove('status-ok');
      status.classList.add('status-error');
    }
  });

  document.getElementById('refreshStatus').addEventListener('click', updateStatus);

  updateStatus();
});