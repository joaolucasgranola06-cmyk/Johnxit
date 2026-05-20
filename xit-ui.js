async function fetchLocalIps() {
  const res = await fetch('/ips');
  if (!res.ok) throw new Error('Falha ao obter IP');
  const data = await res.json();
  return data.ips || [];
}

async function loadIpCommand() {
  const commandEl = document.getElementById('adbCommand');
  try {
    const ips = await fetchLocalIps();
    const hostInput = document.getElementById('hostInput');
    const savedHost = hostInput.value.trim();
    let ip = savedHost;

    if (!savedHost && ips.length > 0) {
      ip = ips[0];
      hostInput.value = ip;
    }

    if (!ip) {
      commandEl.textContent = 'Nenhum IP disponível';
      return;
    }

    const port = document.getElementById('portInput').value.trim() || '41411';
    commandEl.textContent = `adb connect ${ip}:${port}`;
  } catch (error) {
    commandEl.textContent = 'Erro ao carregar IP';
    console.error(error);
  }
}

function setStatus(text, good = true) {
  const status = document.getElementById('statusText');
  status.textContent = text;
  status.style.color = good ? '#a5f3fc' : '#fca5a5';
}

function updateDeployState(text) {
  const deployState = document.getElementById('deployState');
  if (deployState) {
    deployState.textContent = text;
  }
}

function safeCall(action, successMessage, errorMessage, deployText) {
  try {
    if (window.AndroidAimbotBridge && typeof window.AndroidAimbotBridge[action] === 'function') {
      window.AndroidAimbotBridge[action]();
      setStatus(successMessage, true);
      if (deployText) updateDeployState(deployText);
    } else {
      setStatus(errorMessage, false);
    }
  } catch (e) {
    console.error(e);
    setStatus(errorMessage, false);
  }
}

function setOption(key, value) {
  try {
    if (window.AndroidAimbotBridge && typeof window.AndroidAimbotBridge.setConfig === 'function') {
      window.AndroidAimbotBridge.setConfig(key, value);
      setStatus(`${key} ${value ? 'ativado' : 'desativado'}`);
    } else {
      setStatus('Bridge de configuração não encontrada', false);
    }
  } catch (e) {
    console.error(e);
    setStatus('Erro ao aplicar opção', false);
  }
}

let networkEnabled = false;

function toggleNetworkState() {
  networkEnabled = !networkEnabled;
  const button = document.getElementById('toggleNetButton');
  const wifiMode = document.getElementById('wifiMode');
  if (networkEnabled) {
    button.textContent = 'Desativar Wi-Fi';
    wifiMode.textContent = 'Wi-Fi Online';
    wifiMode.style.background = 'rgba(61,215,255,0.18)';
    setStatus('Wi-Fi ativado no painel. Conecte o host externo.');
  } else {
    button.textContent = 'Ativar Wi-Fi';
    wifiMode.textContent = 'Wi-Fi Offline';
    wifiMode.style.background = 'rgba(255,255,255,0.08)';
    setStatus('Wi-Fi desativado no painel. Use rede local se necessário.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadIpCommand();

  document.getElementById('copyButton').addEventListener('click', async () => {
    const text = document.getElementById('adbCommand').textContent;
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Comando copiado!');
    } catch (e) {
      prompt('Copie o comando:', text);
    }
  });

  document.getElementById('refreshButton').addEventListener('click', loadIpCommand);
  document.getElementById('hostInput').addEventListener('change', loadIpCommand);
  document.getElementById('portInput').addEventListener('change', loadIpCommand);

  document.getElementById('startButton').addEventListener('click', () => {
    safeCall('startAimbot', 'Xit ativado', 'Não foi possível ativar.', 'Xit ativo');
  });

  document.getElementById('stopButton').addEventListener('click', () => {
    safeCall('stopAimbot', 'Xit parado', 'Não foi possível parar.', 'Xit parado');
  });

  document.getElementById('toggleNetButton').addEventListener('click', toggleNetworkState);
  document.getElementById('autoFireOn').addEventListener('click', () => setOption('autoFire', true));
  document.getElementById('autoFireOff').addEventListener('click', () => setOption('autoFire', false));
  document.getElementById('debugOn').addEventListener('click', () => setOption('debugMode', true));
  document.getElementById('debugOff').addEventListener('click', () => setOption('debugMode', false));
});
