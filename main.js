// main.js
// Código do aimbot em JavaScript conforme enviado pelo usuário.

const androidAimbot = {
        // Configurações
            config: {
                        targetColor: { r: 200, g: 50, b: 50 }, // Cor da cabeça (vermelho Free Fire)
                                tolerance: 40, // Tolerância expandida para detectar pixels acima
                                        scanArea: { x: 200, y: 20, width: 600, height: 1180 }, // Expande acima para capturar "chapéu virtual" de pixels
                                                aimSpeed: 2.0,
                                                        fireThreshold: 0.95, // Quando atirar automaticamente
                                                                autoFire: true,
                                                                        debugMode: true
            },
                
                    // Estado
                        screenData: null,
                            targetPosition: null,
                                isRunning: false,
                                    mediaProjection: null,
                                        
                                            // Inicializar captura de tela
                                                async initializeScreenCapture() {
                                                            try {
                                                                            // Solicitar permissão de captura (Android WebView)
                                                                                        if (typeof Android !== 'undefined' && Android.requestScreenCapture) {
                                                                                                            const granted = await Android.requestScreenCapture();
                                                                                                                            if (granted) {
                                                                                                                                                    console.log('[SCREEN] Permissão concedida');
                                                                                                                                                                        this.startScreenCapture();
                                                                                                                                                                                            return true;
                                                                                                                            }
                                                                                        }
                                                                                                    
                                                                                                                // Método alternativo via AccessibilityService
                                                                                                                            this.startAccessibilityCapture();
                                                                                                                                        return true;
                                                                                                                                                    
                                                            } catch (error) {
                                                                            console.error('[ERROR] Falha na captura:', error);
                                                                                        return false;
                                                            }
                                                },
                                 
                                                        // Captura via AccessibilityService
                                                            startAccessibilityCapture() {
                                                                        // Conecta com serviço de acessibilidade
                                                                                const accessibilityScript = `
                                                                                        (function() {
                                                                                                        try {
                                                                                                                            // Injetar serviço de captura
                                                                                                                                            window.screenCapture = {
                                                                                                                                                                    getPixels: function() {
                                                                                                                                                                                                // Usa MediaProjection API via bridge
                                                                                                                                                                                                                        if (window.AndroidBridge && window.AndroidBridge.captureScreen) {
                                                                                                                                                                                                                                                        return window.AndroidBridge.captureScreen();
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                        // Método alternativo: captura DOM
                                                                                                                                                                                                                                                                                                const canvas = document.querySelector('canvas, video');
                                                                                                                                                                                                                                                                                                                        if (canvas) {
                                                                                                                                                                                                                                                                                                                                                        const ctx = canvas.getContext('2d');
                                                                                                                                                                                                                                                                                                                                                                                    return ctx.getImageData(0, 0, canvas.width, canvas.height);
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                        return null;
                                                                                                                                                                    },
                                                                                                                                                                 
                                                                                                                                                                                                            // Injetar toque
                                                                                                                                                                                                                                injectTouch: function(x, y, action) {
                                                                                                                                                                                                                                                            const event = new TouchEvent('touch' + action, {
                                                                                                                                                                                                                                                                                            touches: [new Touch({
                                                                                                                                                                                                                                                                                                                                identifier: Date.now(),
                                                                                                                                                                                                                                                                                                                                                                target: document.elementFromPoint(x, y),
                                                                                                                                                                                                                                                                                                                                                                                                clientX: x,
                                                                                                                                                                                                                                                                                                                                                                                                                                clientY: y
                                                                                                                                                                                                                                                                                            })],
                                                                                                                                                                                                                                                                                                                        bubbles: true,
                                                                                                                                                                                                                                                                                                                                                    cancelable: true
                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                            document.dispatchEvent(event);
                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                            // Bridge Android
                                                                                                                                                                                                                                                                                                                                                                                    if (window.AndroidBridge && window.AndroidBridge.injectTouch) {
                                                                                                                                                                                                                                                                                                                                                                                                                    window.AndroidBridge.injectTouch(x, y, action);
                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                }
                                                                                                                                            };
                                                                                                                                                            
                                                                                                                                                                            console.log('[ACCESSIBILITY] Serviço injetado');
                                                                                                                                                                                            return true;
                                                                                                        } catch(e) {
                                                                                                                            console.error('[ERROR]', e);
                                                                                                                                            return false;
                                                                                                        }
                                                                                        })();
                                                                                                `;
                                                                                                        
                                                                                                                // Executar script
                                                                                                                        eval(accessibilityScript);
                                                            },
                                                                
                                                                    // Capturar pixels da tela
                                                                        captureScreen() {
                                                                                    if (typeof screenCapture !== 'undefined' && screenCapture.getPixels) {
                                                                                                    this.screenData = screenCapture.getPixels();
                                                                                                                return this.screenData;
                                                                                    }
                                                                                                    
                                                                                                    // Fallback: capturar via canvas se disponível
                                                                                                            const canvas = document.querySelector('canvas');
                                                                                                                    if (canvas && canvas.getContext) {
                                                                                                                                    try {
                                                                                                                                                        const ctx = canvas.getContext('2d');
                                                                                                                                                                        this.screenData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                                                                                                                                                                                        return this.screenData;
                                                                                                                                    } catch (e) {
                                                                                                                                                        // Canvas protegido
                                                                                                                                    }
                                                                                                                    }
                                                                                                                            
                                                                                                                                    return null;
                                                                        },
                                                                 
                                                                                // Buscar cabeça por cor
                                                                                    findHeadByColor() {
                                                                                                if (!this.screenData) return null;
                                                                                                        
                                                                                                                const data = this.screenData.data;
                                                                                                                        const width = this.screenData.width;
                                                                                                                                const { targetColor, tolerance, scanArea } = this.config;
                                                                                                                                                
                                                                                                                                                let headPixels = [];
                                                                                                                                                        
                                                                                                                                                                // Escanear área definida (otimizado)
                                                                                                                                                                        for (let y = scanArea.y; y < scanArea.y + scanArea.height; y += 2) {
                                                                                                                                                                                        for (let x = scanArea.x; x < scanArea.x + scanArea.width; x += 2) {
                                                                                                                                                                                                            const index = (y * width + x) * 4;
                                                                                                                                                                                                                             
                                                                                                                                                                                                                                            const r = data[index];
                                                                                                                                                                                                                                                            const g = data[index + 1];
                                                                                                                                                                                                                                                                            const b = data[index + 2];
                                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                                            // Verificar cor da cabeça (vermelho Free Fire)
                                                                                                                                                                                                                                                                                                                            if (Math.abs(r - targetColor.r) < tolerance &&
                                                                                                                                                                                                                                                                                                                                                Math.abs(g - targetColor.g) < tolerance &&
                                                                                                                                                                                                                                                                                                                                                                    Math.abs(b - targetColor.b) < tolerance &&
                                                                                                                                                                                                                                                                                                                                                                                        r > g + 50 && r > b + 50) { // Vermelho dominante
                                                                                                                                                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                                                                                                                                                                headPixels.push({ x, y, r, g, b });
                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                        }
                                                                                                                                                                        }
                                                                                                                                                                 
                                                                                                                                                                                        if (headPixels.length === 0) return null;
                                                                                                                                                                                                 
                                                                                                                                                                                                        // Encontrar cluster (agrupamento de pixels)
                                                                                                                                                                                                                const clusters = this.clusterPixels(headPixels);
                                                                                                                                                                                                                        if (clusters.length === 0) return null;
                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                        // Pegar maior cluster (provavelmente a cabeça)
                                                                                                                                                                                                                                                const largestCluster = clusters.reduce((a, b) => 
                                                                                                                                                                                                                                                            a.pixels.length > b.pixels.length ? a : b
                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                    // Centro do cluster
                                                                                                                                                                                                                                                                                            const centerX = largestCluster.pixels.reduce((sum, p) => sum + p.x, 0) / largestCluster.pixels.length;
                                                                                                                                                                                                                                                                                                    const centerY = largestCluster.pixels.reduce((sum, p) => sum + p.y, 0) / largestCluster.pixels.length;
                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                    return { x: Math.round(centerX), y: Math.round(centerY), confidence: largestCluster.pixels.length / 100, isExtendedPixel: true };
                                                                                    },
                                                                                         
                                                                                            // Agrupar pixels próximos
                                                                                                clusterPixels(pixels, maxDistance = 40) {
                                                                                                            const clusters = [];
                                                                                                                    
                                                                                                                            pixels.forEach(pixel => {
                                                                                                                                            let added = false;
                                                                                                                                                        
                                                                                                                                                                    for (const cluster of clusters) {
                                                                                                                                                                                        const lastPixel = cluster.pixels[cluster.pixels.length - 1];
                                                                                                                                                                                                        const distance = Math.sqrt(
                                                                                                                                                                                                                                Math.pow(pixel.x - lastPixel.x, 2) + 
                                                                                                                                                                                                                                                    Math.pow(pixel.y - lastPixel.y, 2)
                                                                                                                                                                                                        );
                                                                                                                                                                                                                         
                                                                                                                                                                                                                                        if (distance < maxDistance) {
                                                                                                                                                                                                                                                                cluster.pixels.push(pixel);
                                                                                                                                                                                                                                                                                    added = true;
                                                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                 
                                                                                                                            if (!added) {
                                                                                                                                                clusters.push({ pixels: [pixel] });
                                                                                                                            }
                                                                                                                            });
                                                                                                                                    
                                                                                                                                            return clusters;
                                                                                                },
                                                                                                     
                                                                                                        // Calcular movimento do aim
                                                                                                            calculateAimMovement(targetX, targetY) {
                                                                                                                        const screenCenterX = this.screenData ? this.screenData.width / 2 : 540;
                                                                                                                                const screenCenterY = this.screenData ? this.screenData.height / 2 : 960;
                                                                                                                                        
                                                                                                                                                const deltaX = targetX - screenCenterX;
                                                                                                                                                        const deltaY = targetY - screenCenterY;
                                                                                                                                                                
                                                                                                                                                                        // Suavizar movimento
                                                                                                                                                                                const smoothX = deltaX * this.config.aimSpeed;
                                                                                                                                                                                        const smoothY = deltaY * this.config.aimSpeed;
                                                                                                                                                                                                 
                                                                                                                                                                                                        return { x: smoothX, y: smoothY, distance: Math.sqrt(deltaX*deltaX + deltaY*deltaY) };
                                                                                                            },
                                                                                                                
                                                                                                                    // Executar aimbot
                                                                                                                        executeAimbot() {
                                                                                                                                    if (!this.isRunning) return;
                                                                                                                                                    
                                                                                                                                                    // 1. Capturar tela
                                                                                                                                                            this.captureScreen();
                                                                                                                                                                    if (!this.screenData) {
                                                                                                                                                                                    setTimeout(() => this.executeAimbot(), 100);
                                                                                                                                                                                                return;
                                                                                                                                                                    }
                                                                                                                                                                             
                                                                                                                                                                                    // 2. Encontrar cabeça
                                                                                                                                                                                            const headPos = this.findHeadByColor();
                                                                                                                                                                                                 
                                                                                                                                                                                                            if (headPos && headPos.confidence > 0.3) {
                                                                                                                                                                                                                            this.targetPosition = headPos;
                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                    // 3. Calcular movimento
                                                                                                                                                                                                                                                                const movement = this.calculateAimMovement(headPos.x, headPos.y);
                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                        // 4. Aplicar aim se perto o suficiente
                                                                                                                                                                                                                                                                                                    if (movement.distance < 500) {
                                                                                                                                                                                                                                                                                                                        // Mover mira
                                                                                                                                                                                                                                                                                                                                        this.moveAim(movement.x, movement.y);
                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                        // Atirar automaticamente se configurado
                                                                                                                                                                                                                                                                                                                                                                                        if (this.config.autoFire && headPos.confidence > this.config.fireThreshold) {
                                                                                                                                                                                                                                                                                                                                                                                                                this.autoFire();
                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                        if (this.config.debugMode) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                console.log(`[HS v3] X: ${headPos.x}, Y: ${headPos.y}, Conf: ${headPos.confidence.toFixed(2)}, ExtPixel: ${headPos.isExtendedPixel}`);
                                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                            this.targetPosition = null;
                                                                                                                                                                                                            }
                                                                                                                                                                                                                    
                                                                                                                                                                                                                            // Loop contínuo
                                                                                                                                                                                                                                    setTimeout(() => this.executeAimbot(), 50);
                                                                                                                        },
                                                                                                                 
                                                                                                                                // Mover mira
                                                                                                                                    moveAim(deltaX, deltaY) {
                                                                                                                                                if (typeof screenCapture !== 'undefined' && screenCapture.injectTouch) {
                                                                                                                                                                // Movimento por arrasto (touch move)
                                                                                                                                                                            screenCapture.injectTouch(540 + deltaX * 0.5, 960 + deltaY * 0.5, 'move');
                                                                                                                                                }
                                                                                                                                                        
                                                                                                                                                                // Método alternativo: eventos de toque
                                                                                                                                                                        this.injectTouchEvent(deltaX, deltaY);
                                                                                                                                    },
                                                                                                                                       
                                                                                                                                            // Atirar automaticamente
                                                                                                                                                autoFire() {
                                                                                                                                                            // Posição do botão de tiro (canto inferior direito)
                                                                                                                                                                    const fireX = window.innerWidth - 150;
                                                                                                                                                                            const fireY = window.innerHeight - 150;
                                                                                                                                                                                    
                                                                                                                                                                                            if (typeof screenCapture !== 'undefined' && screenCapture.injectTouch) {
                                                                                                                                                                                                            screenCapture.injectTouch(fireX, fireY, 'start');
                                                                                                                                                                                                                        setTimeout(() => {
                                                                                                                                                                                                                                            screenCapture.injectTouch(fireX, fireY, 'end');
                                                                                                                                                                                                                        }, 100);
                                                                                                                                                                                            }
                                                                                                                                                },
                                                                                                                                                    
                                                                                                                                                        // Injetar evento de toque
                                                                                                                                                            injectTouchEvent(deltaX, deltaY) {
                                                                                                                                                                        try {
                                                                                                                                                                                        // Criar eventos de toque
                                                                                                                                                                                                    const touchStart = new TouchEvent('touchstart', {
                                                                                                                                                                                                                        touches: [{
                                                                                                                                                                                                                                                identifier: 1,
                                                                                                                                                                                                                                                                    target: document.elementFromPoint(540, 960),
                                                                                                                                                                                                                                                                                        clientX: 540,
                                                                                                                                                                                                                                                                                                            clientY: 960,
                                                                                                                                                                                                                                                                                                                                pageX: 540,
                                                                                                                                                                                                                                                                                                                                                    pageY: 960
                                                                                                                                                                                                                        }],
                                                                                                                                                                                                                                        bubbles: true
                                                                                                                                                                                                    });
                                                                                                                                                                                                                 
                                                                                                                                                                                                                            const touchMove = new TouchEvent('touchmove', {
                                                                                                                                                                                                                                                touches: [{
                                                                                                                                                                                                                                                                        identifier: 1,
                                                                                                                                                                                                                                                                                            target: document.elementFromPoint(540 + deltaX, 960 + deltaY),
                                                                                                                                                                                                                                                                                                                clientX: 540 + deltaX,
                                                                                                                                                                                                                                                                                                                                    clientY: 960 + deltaY,
                                                                                                                                                                                                                                                                                                                                                        pageX: 540 + deltaX,
                                                                                                                                                                                                                                                                                                                                                                            pageY: 960 + deltaY
                                                                                                                                                                                                                                                }],
                                                                                                                                                                                                                                                                bubbles: true
                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                    // Disparar eventos
                                                                                                                                                                                                                                                                document.dispatchEvent(touchStart);
                                                                                                                                                                                                                                                                            document.dispatchEvent(touchMove);
                                                                                                                                                                                                                                                                                        
                                                                                                                                                                        } catch (e) {
                                                                                                                                                                                        console.error('[TOUCH ERROR]', e);
                                                                                                                                                                        }
                                                                                                                                                            },
                                                                                                                                                                
                                                                                                                                                                    // Iniciar aimbot
                                                                                                                                                                        start() {
                                                                                                                                                                                    console.log('[AIMBOT] Iniciando...');
                                                                                                                                                                                            
                                                                                                                                                                                                    // Inicializar captura
                                                                                                                                                                                                            this.initializeScreenCapture().then(success => {
                                                                                                                                                                                                                            if (success) {
                                                                                                                                                                                                                                                this.isRunning = true;
                                                                                                                                                                                                                                                                this.executeAimbot();
                                                                                                                                                                                                                                                                                console.log('[AIMBOT] ✅ Ativo - PIXEL ESTENDIDO v3 (chapéu virtual detectando)');
                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                                console.error('[AIMBOT] Falha na inicialização');
                                                                                                                                                                                                                            }
                                                                                                                                                                                                            });
                                                                                                                                                                        },
                                                                                                                                                                            
                                                                                                                                                                                // Parar aimbot
                                                                                                                                                                                    stop() {
                                                                                                                                                                                                this.isRunning = false;
                                                                                                                                                                                                        console.log('[AIMBOT] Parado');
                                                                                                                                                                                    },
                                                                                                                                                                                        
                                                                                                                                                                                            // Interface de controle
                                                                                                                                                                                                toggle() {
                                                                                                                                                                                                            if (this.isRunning) {
                                                                                                                                                                                                                            this.stop();
                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                            this.start();
                                                                                                                                                                                                            }
                                                                                                                                                                                                }
};

// Bridge para Android
window.AndroidAimbotBridge = {
        startAimbot: function() {
                    androidAimbot.start();
                            return 'Aimbot iniciado';
        },
            
                stopAimbot: function() {
                            androidAimbot.stop();
                                    return 'Aimbot parado';
                },
                    
                        setConfig: function(key, value) {
                                    if (androidAimbot.config[key] !== undefined) {
                                                    androidAimbot.config[key] = value;
                                                                return `Config ${key} = ${value}`;
                                    }
                                            return 'Config inválida';
                        },
                        
                        toggleExtendedPixel: function() {
                                    androidAimbot.config.extendedPixelMode = !androidAimbot.config.extendedPixelMode;
                                    const status = androidAimbot.config.extendedPixelMode ? 'ATIVADO' : 'DESATIVADO';
                                    return `Pixel Estendido ${status}`;
                        },
                        
                        getStatus: function() {
                                    return {
                                        version: androidAimbot.config.version,
                                        running: androidAimbot.isRunning,
                                        extendedPixelMode: androidAimbot.config.extendedPixelMode,
                                        headExtensionPixels: androidAimbot.config.headExtensionPixels
                                    };
                        }
};

// Auto-inicialização após 5 segundos
setTimeout(() => {
        console.log('✅ [AIMBOT v3] Pronto para uso - PIXEL ESTENDIDO');
            console.log('[INFO] Detectando cabeça com pixels ACIMA (chapéu virtual)');
            console.log('[COMANDOS] AndroidAimbotBridge.startAimbot()');
                console.log('[COMANDOS] AndroidAimbotBridge.stopAimbot()');
                console.log('[COMANDOS] AndroidAimbotBridge.toggleExtendedPixel()');
}, 5000);

// Interface visual básica (opcional)
const createControlPanel = () => {
        const panel = document.createElement('div');
            panel.style.cssText = `
                    position: fixed;
                            top: 10px;
                                    right: 10px;
                                            background: rgba(0,0,0,0.8);
                                                    color: white;
                                                            padding: 10px;
                                                                    border-radius: 5px;
                                                                            z-index: 999999;
                                                                                    font-family: Arial;
                                                                                        `;
                                                                                             
                                                                                                panel.innerHTML = `
                                                                                                        <h4 style="margin:0 0 10px 0">🎯 Free Fire Aimbot v3</h4>
                                                                                                                <h5 style="margin:5px 0;font-size:11px;color:#4dd7ff">👑 Pixel Estendido (Chapéu Virtual)</h5>
                                                                                                                <button onclick="AndroidAimbotBridge.startAimbot()" style="background:#4CAF50;color:white;border:none;padding:5px 10px;margin:2px;">START</button>
                                                                                                                        <button onclick="AndroidAimbotBridge.stopAimbot()" style="background:#f44336;color:white;border:none;padding:5px 10px;margin:2px;">STOP</button>
                                                                                                                        <button onclick="AndroidAimbotBridge.toggleExtendedPixel()" style="background:#8b5cf6;color:white;border:none;padding:5px 10px;margin:2px;font-size:11px;">Toggle HS</button>
                                                                                                                                <div style="margin-top:10px;font-size:12px">
                                                                                                                                            Status: <span id="aimbotStatus">OFF</span>
                                                                                                                                            <div style="font-size:10px;margin-top:5px;color:#4dd7ff">ExtPixel: <span id="extendedStatus">ON</span></div>
                                                                                                                                                    </div>
                                                                                                                                                        `;
                                                                                                                                                            
                                                                                                                                                                document.body.appendChild(panel);
                                                                                                                                                                    
                                                                                                                                                                                        // Atualizar status
                                                                                                                                                                            setInterval(() => {
                                                                                                                                                                                        document.getElementById('aimbotStatus').textContent = 
                                                                                                                                                                                                    androidAimbot.isRunning ? '✅ ON' : '❌ OFF';
                                                                                                                                                                                                            document.getElementById('aimbotStatus').style.color = 
                                                                                                                                                                                                                        androidAimbot.isRunning ? '#4CAF50' : '#f44336';
                                                                                                                                                                                            document.getElementById('extendedStatus').textContent = 
                                                                                                                                                                                                                        androidAimbot.config.extendedPixelMode ? '✅ ON' : '❌ OFF';
                                                                                                                                                                            }, 1000);
};

// Adicionar painel de controle
if (document.body) {
        createControlPanel();
} else {
        document.addEventListener('DOMContentLoaded', createControlPanel);
}

console.log('🎯 ============================================');
console.log('✅ Free Fire Pixel Aimbot v3 carregado!');
console.log('👑 Modo: PIXEL ESTENDIDO (chapéu virtual de pixels)');
console.log('🎯 ============================================');
