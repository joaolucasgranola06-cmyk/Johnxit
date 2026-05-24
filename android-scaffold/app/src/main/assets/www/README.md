# Android WebView App (Demo)

Este diretório contém os assets web de um aplicativo demonstrativo (WebView) com uma interface "xitada" e um botão que simula a ativação do recurso "HS Pescoço".

IMPORTANTE: Este projeto é apenas uma DEMONSTRAÇÃO UI. Não habilita cheats, não modifica jogos e não executa ações maliciosas.

Opções para empacotar em APK:

1) Usando Capacitor (recomendado):

```bash
# instale o Capacitor globalmente se ainda não tiver
npm i -g @capacitor/cli

# no diretório do repositório
cd android-app
npm init -y
npm i @capacitor/core @capacitor/cli

# copie os arquivos (index.html, styles.css, app.js) para public/
mkdir -p public
cp index.html styles.css app.js public/

npx cap init com.seu.dominio.xitdemo XitDemo
npx cap add android
npx cap copy android
npx cap open android
```

Abra o projeto Android no Android Studio e construa o APK. Isso criará um APK unsigned; para assinar, use as ferramentas do Android Studio.

2) Usando Cordova (alternativa rápida):

```bash
npm i -g cordova
cordova create xitdemo com.seu.dominio.xitdemo XitDemo
cd xitdemo
cordova platform add android
# copie os arquivos para www/
cp ../../android-app/* www/
cordova build android
```

Se quiser, eu posso:
- Gerar um projeto Android Studio (gradle) pronto para compilar (scaffold completo). 
- Tentar compilar um APK aqui (ambiente pode não ter Android SDK). 

Diga qual opção prefere: "scaffold" (projeto Android Studio) ou "build aqui" (tentar criar APK).