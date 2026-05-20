# Painel Profissional — Debug por Wi‑Fi

Interface moderna para demonstração e venda. Gera comandos ADB para conectar dispositivos Android por Wi‑Fi e inclui um painel responsivo pronto para personalização.

## Conteúdo do repositório
- `index.html` — layout do painel
- `styles.css` — estilos modernos e responsivos
- `dashboard.js` — lógica do gerador de comandos ADB
- `server.js` — servidor estático e endpoint `/ips`
- `xit.html` — interface mínima do xit com botão de ativar
- `xit-ui.js` — controle do botão, geração do comando ADB e porta customizável

> Observação: este repositório contém código de exemplo. Use de forma responsável e não compartilhe acesso de depuração com terceiros.

## Requisitos
- Node.js (>=14)
- ADB (Android Debug Bridge) instalado no host para conectar dispositivos Android

## Rodando localmente
```bash
# instalar dependências
npm install

# iniciar servidor (escuta em 0.0.0.0 para acesso na LAN)
npm run serve
```

O servidor exibirá os IPs locais no terminal; abra o endereço em outro dispositivo na mesma rede (ex.: `http://192.168.1.42:8080`).

## Como usar o gerador ADB (fluxo rápido)
1. Ative as Opções de Desenvolvedor no Android e habilite “Depuração USB”.
2. Conecte o dispositivo por USB ao computador e execute no host:
```bash
adb devices
adb tcpip 5555
```
3. Desconecte o cabo USB.
4. No painel, clique em `Gerar` e depois em `Copiar` para obter o comando recomendado.
5. Execute no host:
```bash
adb connect <IP_DO_SERVIDOR>:5555
```
6. Para desconectar:
```bash
adb disconnect <IP_DO_SERVIDOR>:5555
```

## Personalização para venda
- Troque cores em `styles.css` (variáveis no topo do arquivo).
- Atualize textos, CTAs e e‑mail de contato em `index.html` e `dashboard.js`.
- Adicione imagens em `assets/` e referencie-as no README para material comercial.

## Próximos passos sugeridos
- Gerar screenshots e PDF de apresentação.
- Incluir script que empacote os arquivos em um ZIP pronto para entrega ao cliente.
Quer que eu gere screenshots de demonstração e um PDF de proposta comercial agora?

## Material gerado (demonstrativo)
- `assets/screenshot-1.svg` — mockup do painel
- `assets/screenshot-2.svg` — resumo e benefícios
- `docs/proposal.html` — proposta comercial pronta para impressão (arquivo HTML, abra e exporte como PDF)

Para gerar o PDF da proposta, abra `docs/proposal.html` no navegador e use Print → Save as PDF (isso garante qualidade e tipografia controlada).
