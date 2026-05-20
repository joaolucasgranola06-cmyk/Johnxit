async function fetchIPs(){
  try{
    const res = await fetch('/ips');
    if(!res.ok) throw new Error('failed');
    const data = await res.json();
    return data.ips||[];
  }catch(e){return []}
}

function buildCmd(ip){
  return `adb connect ${ip}:5555`;
}

async function initDashboard(){
  const ipsInput = document.getElementById('ipsInput');
  const cmdPre = document.getElementById('cmdPre');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');

  const ips = await fetchIPs();
  if(ips.length===0){
    ipsInput.value = 'Nenhum IP local detectado';
    cmdPre.textContent = '—';
  } else {
    ipsInput.value = ips.join(', ');
    cmdPre.textContent = buildCmd(ips[0]);
  }

  generateBtn.addEventListener('click', ()=>{
    const list = ips.length?ips:[].slice();
    if(list.length===0) return alert('Nenhum IP disponível');
    cmdPre.textContent = buildCmd(list[0]);
  });

  copyBtn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(cmdPre.textContent);
      copyBtn.textContent = 'Copiado';
      setTimeout(()=> copyBtn.textContent = 'Copiar',1200);
    }catch(e){
      prompt('Copie o comando manualmente:', cmdPre.textContent);
    }
  });

  document.getElementById('demoBtn').addEventListener('click', ()=>{
    window.scrollTo({top:document.getElementById('features').offsetTop - 20,behavior:'smooth'});
  });

  document.getElementById('contactBtn').addEventListener('click', ()=>{
    location.href = '#';
    alert('Entre em contato: seuemail@exemplo.com');
  });

  document.getElementById('buyBtn').addEventListener('click', ()=>{
    alert('Página de compra em construção. Posso gerar um PDF com proposta.');
  });
}

window.addEventListener('DOMContentLoaded', initDashboard);
