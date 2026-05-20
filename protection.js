#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function printUsage() {
    console.log('Uso: node protection.js <entrada.js> <saida.js>');
    console.log('Exemplo: node protection.js aimbot.js aimbot-obfuscated.js');
}

function obfuscateCode(source, options = {}) {
    try {
        const obfuscator = require('javascript-obfuscator');
        return obfuscator.obfuscate(source, {
            compact: true,
            controlFlowFlattening: true,
            ...options,
        }).getObfuscatedCode();
    } catch (error) {
        console.error('Erro: não foi possível carregar javascript-obfuscator.');
        console.error('Instale com: npm install -g javascript-obfuscator');
        throw error;
    }
}

function run() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        printUsage();
        process.exit(1);
    }

    const [inputFile, outputFile] = args;
    const inputPath = path.resolve(process.cwd(), inputFile);
    const outputPath = path.resolve(process.cwd(), outputFile);

    if (!fs.existsSync(inputPath)) {
        console.error(`Arquivo de entrada não encontrado: ${inputPath}`);
        process.exit(1);
    }

    const source = fs.readFileSync(inputPath, 'utf8');
    const obfuscated = obfuscateCode(source);
    fs.writeFileSync(outputPath, obfuscated, 'utf8');

    console.log(`Arquivo ofuscado gerado em: ${outputPath}`);
}

if (require.main === module) {
    run();
}

module.exports = {
    obfuscateCode,
};