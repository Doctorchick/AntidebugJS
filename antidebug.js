(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        redirectUrl: 'about:blank', // Votre page d'erreur
        reloadOnTamper: true,        // true = reload, false = redirect
        alertEnabled: false,         // Désactiver les alertes pour UX
        consoleSpamInterval: 1000,   // Fréquence du spam console
        devToolsCheckInterval: 500,  // Fréquence de vérification DevTools
        performanceThreshold: 50     // Seuil de détection performance
    };

    
    let protectionState = {
        devToolsOpen: false,
        jsRunning: true,
        originalHTML: '',
        protectionActive: true,
        intervals: []
    };
    function createInterval(func, delay) {
        const id = setInterval(func, delay);
        protectionState.intervals.push(id);
        return id;
    }
    function initializeUIProtection() {
        const events = ['contextmenu', 'selectstart', 'dragstart'];
        events.forEach(eventType => {
            document.addEventListener(eventType, function(e) {
                e.preventDefault();
                return false;
            });
        });
        document.addEventListener('DOMContentLoaded', function() {
            const style = document.createElement('style');
            style.textContent = `
                * {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                    -webkit-touch-callout: none !important;
                    -webkit-tap-highlight-color: transparent !important;
                }
                body {
                    -webkit-user-drag: none !important;
                    -khtml-user-drag: none !important;
                    -moz-user-drag: none !important;
                    -o-user-drag: none !important;
                    user-drag: none !important;
                }
            `;
            document.head.appendChild(style);
        });
    }
    function initializeKeyboardProtection() {
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.keyCode === 65) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }
            if (e.keyCode === 116 && CONFIG.reloadOnTamper) {
                e.preventDefault();
                return false;
            }
        });
    }
    function detectDevToolsBySize() {
        createInterval(function() {
            const threshold = 160;
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!protectionState.devToolsOpen) {
                    protectionState.devToolsOpen = true;
                    handleTamperDetection('DevTools détectés (taille)');
                }
            } else {
                protectionState.devToolsOpen = false;
            }
        }, CONFIG.devToolsCheckInterval);
    }
    function detectDevToolsByPerformance() {
        createInterval(function() {
            const start = performance.now();
            console.clear();
            const end = performance.now();
            
            if (end - start > CONFIG.performanceThreshold) {
                handleTamperDetection('DevTools détectés (performance)');
            }
        }, 2000);
    }
    function initializeAntiDebugger() {
        function antiDebug() {
            createInterval(function() {
                (function() {
                    try {
                        debugger;
                    } catch(e) {}
                })();
            }, 100);
        }
        for (let i = 0; i < 3; i++) {
            setTimeout(antiDebug, i * 100);
        }
    }
    function detectBreakpoints() {
        createInterval(function() {
            const start = performance.now();
            let dummy = 0;
            for (let i = 0; i < 10000; i++) {
                dummy += Math.random() * i;
            }
            
            const end = performance.now();
            
            if (end - start > CONFIG.performanceThreshold) {
                handleTamperDetection('Breakpoint détecté');
            }
        }, 3000);
    }

    function protectGlobalProperties() {
        try {
            Object.defineProperty(window, 'isProtected', {
                get: function() { return true; },
                set: function() { 
                    handleTamperDetection('Tentative de modification de propriété');
                    return true;
                },
                configurable: false
            });
            const originalConsole = window.console;
            Object.defineProperty(window, 'console', {
                get: function() { return originalConsole; },
                set: function() { 
                    handleTamperDetection('Tentative de modification de console');
                    return originalConsole;
                },
                configurable: false
            });
        } catch(e) {
        }
    }
    function initializeConsoleSpam() {
        const spamInterval = createInterval(function() {
            if (typeof console !== 'undefined') {
                console.clear();
                console.log('%c🛡️ ACCÈS REFUSÉ', 'color: #ff3333; font-size: 30px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
                console.log('%c' + '█'.repeat(100), 'color: #ff3333; font-weight: bold;');
                console.log('%c🚫 DEBUG INTERDIT - PROTECTION ACTIVE 🚫', 'color: #ff6666; font-size: 18px; font-weight: bold;');
                console.log('%c' + '█'.repeat(100), 'color: #ff3333; font-weight: bold;');
                const messages = [
                    'Surveillance active...',
                    'Tentative de debug détectée',
                    'Accès non autorisé',
                    'Protection renforcée'
                ];
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                console.log('%c' + randomMsg, 'color: #ffaa33; font-size: 14px;');
            }
        }, CONFIG.consoleSpamInterval);
        
        return spamInterval;
    }
    function obfuscateFunctions() {
        const sensitiveKeywords = ['detectDevTools', 'antiDebug', 'protection', 'breakpoint'];
        const originalToString = Function.prototype.toString;
        
        Function.prototype.toString = function() {
            const funcString = originalToString.call(this);
            if (sensitiveKeywords.some(keyword => funcString.includes(keyword))) {
                return 'function() { [Code Protégé] }';
            }
            
            return funcString;
        };
    }
    function initializeDOMIntegrity() {
        document.addEventListener('DOMContentLoaded', function() {
            protectionState.originalHTML = document.documentElement.outerHTML;
        });
        createInterval(function() {
            if (protectionState.originalHTML && 
                document.documentElement.outerHTML !== protectionState.originalHTML) {
            }
        }, 10000);
    }

    function detectToolsAndExtensions() {
        createInterval(function() {
            if (window.console && window.console.firebug) {
                handleTamperDetection('Firebug détecté');
            }

            if (window.chrome && (window.chrome.extension || window.chrome.runtime)) {
                console.warn('Extension détectée');
            }

            if (window.devtools || window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                handleTamperDetection('Outils de développement détectés');
            }
        }, 5000);
    }
    function monitorJavaScriptStatus() {
        protectionState.jsRunning = true;
        
        const jsCheck = createInterval(function() {
            protectionState.jsRunning = true;
        }, 500);
        
        setTimeout(function() {
            if (!protectionState.jsRunning) {
                document.body.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        z-index: 999999;
                    ">
                        <div style="text-align: center; padding: 2rem;">
                            <h1 style="font-size: 3rem; margin-bottom: 1rem;">⚠️</h1>
                            <h2 style="font-size: 2rem; margin-bottom: 1rem;">JavaScript Requis</h2>
                            <p style="font-size: 1.2rem; opacity: 0.9;">
                                Cette page nécessite JavaScript pour fonctionner correctement.<br>
                                Veuillez activer JavaScript dans votre navigateur.
                            </p>
                        </div>
                    </div>
                `;
            }
        }, 3000);
    }
    function handleTamperDetection(reason) {
        console.warn('Protection déclenchée:', reason);
        
        if (CONFIG.alertEnabled) {
            setTimeout(() => alert('Page protégée contre le debug'), 100);
        }
        
        if (CONFIG.reloadOnTamper) {
            setTimeout(() => window.location.reload(), 500);
        } else {
            setTimeout(() => window.location.href = CONFIG.redirectUrl, 500);
        }
    }
    function executeObfuscatedCode() {
        const obscuredCodes = [
            btoa(`
                setInterval(function() {
                    if (window.console && typeof window.console.profiles !== 'undefined') {
                        handleTamperDetection('Console profiling détecté');
                    }
                }, 2000);
            `),
            btoa(`
                if (window.outerHeight < 100 || window.outerWidth < 100) {
                    handleTamperDetection('Fenêtre trop petite - debug suspecté');
                }
            `)
        ];
        
        obscuredCodes.forEach((code, index) => {
            try {
                setTimeout(() => eval(atob(code)), index * 1000);
            } catch(e) {
                console.log('Erreur décodage code', index);
            }
        });
    }
    function cleanup() {
        protectionState.intervals.forEach(id => clearInterval(id));
        protectionState.intervals = [];
    }

    function initialize() {
        console.clear();
        console.log('%c SYSTÈME DE PROTECTION ACTIF', 'color: #ff6b6b; font-size: 18px; font-weight: bold;');
        console.log('%cProtection anti-debug initialisée', 'color: #ffa726; font-size: 14px;');
        
        initializeUIProtection();
        initializeKeyboardProtection();
        detectDevToolsBySize();
        detectDevToolsByPerformance();
        initializeAntiDebugger();
        detectBreakpoints();
        protectGlobalProperties();
        initializeConsoleSpam();
        obfuscateFunctions();
        initializeDOMIntegrity();
        detectToolsAndExtensions();
        monitorJavaScriptStatus();
        executeObfuscatedCode();
        
        if (CONFIG.alertEnabled) {
            setTimeout(() => alert('Protection activé'), 1000);
        }
        
        window.addEventListener('beforeunload', cleanup);
        
        console.log('%c Protection complètement initialisée', 'color: #4caf50; font-weight: bold;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();