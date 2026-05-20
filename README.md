# johnxit

## Pré-requisitos para usar via Web / JavaScript

Antes de executar ou testar via web, certifique-se de que o dispositivo Android tenha:

- Ativado as "Opções de Desenvolvedor"
- Ativado a "Depuração USB"
- Permitido a instalação de aplicativos de fontes desconhecidas

Esses passos são necessários para permitir a instalação e depuração local de apps durante o desenvolvimento.

## Execução via rede

O código JavaScript também pode ser executado usando uma conexão via IP sem fio, por exemplo acessando o WebView ou página a partir de outro dispositivo na mesma rede.

- Garanta que o dispositivo esteja conectado à mesma rede Wi-Fi.
- Use o endereço IP do dispositivo para abrir a página ou console remoto.
- Isso permite testar e injetar o script remotamente via internet local.

## Servidor local de testes

O projeto agora inclui um servidor local que expõe `index.html`, `main.js`, `protection.js` e `script_frida.js`.

Para iniciar o servidor:

```bash
npm run serve
```

Abra no navegador do dispositivo ou em outro aparelho na mesma rede:

```bash
http://<IP_DO_DISPOSITIVO>:8080
```

A página principal já inclui o xit e botões para ativar ou desativar o aimbot.

- Use `START Xit` para iniciar.
- Use `STOP Xit` para parar.
- Se quiser, abra o console e execute:

```js
AndroidAimbotBridge.startAimbot()
```

Se o navegador estiver no mesmo dispositivo onde o script roda, use `http://localhost:8080`.
