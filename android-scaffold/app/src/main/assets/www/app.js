document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('activateBtn');
  const stateEl = document.getElementById('state');
  const icon = document.getElementById('btnIcon');
  const text = document.getElementById('btnText');

  let active = false;

  function setUI() {
    if (active) {
      btn.classList.add('active');
      stateEl.textContent = 'Ativo';
      stateEl.classList.remove('off');
      stateEl.classList.add('on');
      icon.textContent = '🔴';
      text.textContent = 'Desativar HS Pescoço';
    } else {
      btn.classList.remove('active');
      stateEl.textContent = 'Inativo';
      stateEl.classList.remove('on');
      stateEl.classList.add('off');
      icon.textContent = '⚡';
      text.textContent = 'Ativar HS Pescoço';
    }
  }

  btn.addEventListener('click', () => {
    // NÃO executa cheat — apenas simula a ação localmente e tenta notificar o servidor
    active = !active;
    setUI();

    // Tenta chamar o servidor para aplicar estado (fallback para localhost:8080)
    (async () => {
      try {
        const basePaths = [location.origin, 'http://localhost:8080'];
        let ok = false;
        for (const base of basePaths) {
          if (!base || base === 'null') continue;
          const url = base + (active ? '/activate' : '/deactivate');
          try {
            const res = await fetch(url, { method: 'POST' });
            if (res.ok) { ok = true; break; }
          } catch (e) {
            // ignore and try next
          }
        }

        if (!ok) console.warn('Não foi possível notificar o servidor (tente executar node server.js)');
      } catch (e) {
        console.warn('Erro ao notificar servidor', e);
      }
    })();

    // Se houver bridge Android real, chama método seguro opcionalmente
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.onToggle === 'function') {
        window.AndroidBridge.onToggle(active ? 'activate' : 'deactivate');
      }
    } catch (e) {
      console.warn('Bridge inexistente ou erro ao chamar');
    }
  });

  setUI();
});