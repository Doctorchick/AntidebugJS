/**
 * AntidebugJS++ - Military Grade Anti-Debug System
 * Client-Side Core Protection Engine
 * Version: 2.0.0
 */

class AntidebugCore {
    constructor(config = {}) {
        this.config = {
            serverEndpoint: config.serverEndpoint || '/api/antidebug',
            clientId: config.clientId || 'default',
            aggressiveMode: config.aggressiveMode || false,
            steathMode: config.stealthMode || true,
            enableWasm: config.enableWasm || true,
            mutationInterval: config.mutationInterval || 30000,
            ...config
        };
        
        this.sessionId = this.generateSessionId();
        this.detectionCount = 0;
        this.isCompromised = false;
        this.originalFunctions = new Map();
        this.honeypots = new Set();
        this.wasmModule = null;
        this.encryptedModules = new Map();
        this.polymorphicCode = '';
        this.fingerprint = '';
        
        this.init();
    }

    async init() {
        await this.initializeWasm();
        this.storeOriginalFunctions();
        this.generateFingerprint();
        this.setupPolymorphicEngine();
        this.deployHoneypots();
        this.startProtectionLoop();
        this.setupEventListeners();
        this.fetchServerConfig();
    }

    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return btoa(`${timestamp}-${random}`).replace(/[^a-zA-Z0-9]/g, '');
    }

    async initializeWasm() {
        if (!this.config.enableWasm) return;
        
        const wasmCode = new Uint8Array([
            0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
            0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01,
            0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01,
            0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x0a, 0x09,
            0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a,
            0x0b
        ]);

        try {
            this.wasmModule = await WebAssembly.instantiate(wasmCode);
        } catch (e) {
            this.reportDetection('wasm_blocked', 'WebAssembly blocked or unsupported');
        }
    }

    storeOriginalFunctions() {
        const criticalFunctions = [
            'console.log', 'console.warn', 'console.error', 'console.debug',
            'Function.prototype.toString', 'Object.defineProperty',
            'performance.now', 'Date.now', 'setTimeout', 'setInterval',
            'fetch', 'XMLHttpRequest', 'WebSocket'
        ];

        criticalFunctions.forEach(funcPath => {
            const obj = this.getObjectByPath(funcPath);
            if (obj.target && obj.property) {
                this.originalFunctions.set(funcPath, obj.target[obj.property]);
            }
        });
    }

    getObjectByPath(path) {
        const parts = path.split('.');
        let current = window;
        
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
            if (!current) return { target: null, property: null };
        }
        
        return {
            target: current,
            property: parts[parts.length - 1]
        };
    }

    generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Fingerprint test', 2, 2);
        
        this.fingerprint = btoa(JSON.stringify({
            canvas: canvas.toDataURL(),
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            platform: navigator.platform,
            languages: navigator.languages,
            webgl: this.getWebGLFingerprint(),
            audio: this.getAudioFingerprint()
        }));
    }

    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return null;
            
            return {
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                version: gl.getParameter(gl.VERSION)
            };
        } catch (e) {
            return null;
        }
    }

    getAudioFingerprint() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
            
            const analyser = audioContext.createAnalyser();
            oscillator.connect(analyser);
            analyser.connect(audioContext.destination);
            
            oscillator.start(0);
            oscillator.stop();
            
            return analyser.frequencyBinCount.toString();
        } catch (e) {
            return null;
        }
    }

    setupPolymorphicEngine() {
        this.polymorphicCode = this.generatePolymorphicCode();
        
        setInterval(() => {
            if (!this.isCompromised) {
                this.mutateCode();
            }
        }, this.config.mutationInterval);
    }

    generatePolymorphicCode() {
        const patterns = [
            () => `const ${this.randomVar()} = ${Math.random()};`,
            () => `function ${this.randomVar()}() { return ${Math.random()}; }`,
            () => `const ${this.randomVar()} = () => ${Math.random()};`
        ];
        
        return patterns[Math.floor(Math.random() * patterns.length)]();
    }

    mutateCode() {
        this.polymorphicCode = this.generatePolymorphicCode();
        try {
            eval(this.polymorphicCode);
        } catch (e) {
            this.reportDetection('code_mutation_blocked', 'Code mutation was blocked');
        }
    }

    randomVar() {
        return 'var_' + Math.random().toString(36).substring(2, 8);
    }

    deployHoneypots() {
        // Fake API keys
        window.__DEBUG_API_KEY__ = 'fake_key_' + Math.random().toString(36);
        window.__ADMIN_TOKEN__ = 'fake_token_' + Math.random().toString(36);
        
        // Fake debug functions
        window.enableDebug = () => {
            this.reportDetection('honeypot_accessed', 'Fake debug function called');
            return false;
        };
        
        window.getSecrets = () => {
            this.reportDetection('honeypot_accessed', 'Fake secrets function called');
            return { fake: 'data' };
        };
        
        // Fake console override
        const originalConsole = window.console;
        Object.defineProperty(window, 'console', {
            get: () => {
                this.reportDetection('console_access', 'Console accessed');
                return originalConsole;
            },
            configurable: false
        });
    }

    startProtectionLoop() {
        const checks = [
            () => this.detectDevTools(),
            () => this.detectBreakpoints(),
            () => this.detectInjection(),
            () => this.detectHeadless(),
            () => this.detectCodeModification(),
            () => this.detectVirtualMachine(),
            () => this.detectTampermonkey(),
            () => this.detectThrottling()
        ];
        
        const runChecks = () => {
            if (this.isCompromised) return;
            
            checks.forEach((check, index) => {
                setTimeout(() => {
                    try {
                        check();
                    } catch (e) {
                        this.reportDetection('check_error', `Check ${index} failed: ${e.message}`);
                    }
                }, Math.random() * 1000);
            });
        };
        
        runChecks();
        setInterval(runChecks, 2000 + Math.random() * 3000);
    }

    detectDevTools() {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            this.reportDetection('devtools_open', 'DevTools detected via window dimensions');
        }
        
        // Advanced DevTools detection
        let devtools = {open: false, orientation: null};
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
                devtools.open = true;
                devtools.orientation = (window.outerHeight - window.innerHeight > 200) ? 'vertical' : 'horizontal';
                this.reportDetection('devtools_advanced', `DevTools ${devtools.orientation} detected`);
            }
        }, 500);
        
        // Console log detection
        let element = document.createElement('div');
        Object.defineProperty(element, 'id', {
            get: () => {
                this.reportDetection('console_log_detection', 'Element logged to console');
                return 'detected';
            }
        });
        console.log(element);
        console.clear();
    }

    detectBreakpoints() {
        const start = performance.now();
        
        // Performance timing check
        debugger;
        
        const elapsed = performance.now() - start;
        if (elapsed > 100) {
            this.reportDetection('breakpoint_detected', `Debugger pause detected: ${elapsed}ms`);
        }
        
        // Function toString analysis
        const testFunc = function() { return 42; };
        const originalToString = this.originalFunctions.get('Function.prototype.toString');
        
        if (originalToString) {
            const funcString = originalToString.call(testFunc);
            if (funcString.includes('[native code]') || funcString.length !== testFunc.toString().length) {
                this.reportDetection('function_modified', 'Function.toString was modified');
            }
        }
    }

    detectInjection() {
        // Check for common script injection tools
        const injectionSignatures = [
            'tampermonkey', 'greasemonkey', 'violentmonkey',
            'userscript', 'chrome-extension', 'moz-extension',
            '__nightmare', '__phantomjs', '__selenium',
            'webdriver', '_Selenium_IDE_Recorder'
        ];
        
        injectionSignatures.forEach(signature => {
            if (window[signature] || document.documentElement.getAttribute(signature)) {
                this.reportDetection('injection_detected', `Injection tool detected: ${signature}`);
            }
        });
        
        // Check for modified global objects
        const criticalGlobals = ['console', 'fetch', 'XMLHttpRequest'];
        criticalGlobals.forEach(global => {
            if (window[global].toString().includes('[native code]') === false) {
                this.reportDetection('global_modified', `Global ${global} was modified`);
            }
        });
    }

    detectHeadless() {
        const tests = [
            () => navigator.webdriver === true,
            () => window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect,
            () => navigator.languages && navigator.languages.length === 0,
            () => navigator.plugins.length === 0,
            () => !navigator.permissions,
            () => window.outerWidth === 0 || window.outerHeight === 0
        ];
        
        tests.forEach((test, index) => {
            if (test()) {
                this.reportDetection('headless_detected', `Headless browser test ${index} failed`);
            }
        });
    }

    detectCodeModification() {
        const criticalCode = this.toString();
        const hash = this.simpleHash(criticalCode);
        
        if (this.originalHash && this.originalHash !== hash) {
            this.reportDetection('code_modified', 'Core code was modified');
        } else if (!this.originalHash) {
            this.originalHash = hash;
        }
    }

    detectVirtualMachine() {
        const vmSignatures = [
            () => screen.width === 1024 && screen.height === 768,
            () => navigator.hardwareConcurrency === 1,
            () => navigator.deviceMemory && navigator.deviceMemory < 2
        ];
        
        vmSignatures.forEach((test, index) => {
            if (test()) {
                this.reportDetection('vm_detected', `VM signature ${index} detected`);
            }
        });
    }

    detectTampermonkey() {
        const tampermonkeyTests = [
            () => typeof GM_info !== 'undefined',
            () => typeof unsafeWindow !== 'undefined',
            () => typeof GM_setValue !== 'undefined',
            () => document.documentElement.hasAttribute('data-adblockkey'),
            () => window.external && window.external.toString() && window.external.toString().indexOf('Sequentum') !== -1
        ];
        
        tampermonkeyTests.forEach((test, index) => {
            if (test()) {
                this.reportDetection('tampermonkey_detected', `Tampermonkey test ${index} positive`);
            }
        });
    }

    detectThrottling() {
        const iterations = 50000;
        const start = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            Math.random();
        }
        
        const elapsed = performance.now() - start;
        if (elapsed > 100) {
            this.reportDetection('throttling_detected', `Performance throttling detected: ${elapsed}ms`);
        }
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    async reportDetection(type, details) {
        this.detectionCount++;
        
        const report = {
            sessionId: this.sessionId,
            clientId: this.config.clientId,
            type,
            details,
            timestamp: Date.now(),
            fingerprint: this.fingerprint,
            url: window.location.href,
            userAgent: navigator.userAgent,
            detectionCount: this.detectionCount
        };
        
        try {
            const response = await fetch(`${this.config.serverEndpoint}/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(report)
            });
            
            if (response.ok) {
                const action = await response.json();
                this.executeCounterMeasure(action);
            }
        } catch (e) {
            // Fallback to local countermeasures
            this.executeCounterMeasure({ action: 'freeze', severity: 'medium' });
        }
    }

    executeCounterMeasure(action) {
        if (this.isCompromised) return;
        
        switch (action.action) {
            case 'session_kill':
                this.killSession();
                break;
            case 'redirect_trap':
                this.redirectTrap();
                break;
            case 'cpu_flood':
                this.floodCpu(action.severity);
                break;
            case 'freeze':
                this.randomFreeze();
                break;
            case 'diversion':
                this.activateDiversion();
                break;
            case 'self_heal':
                this.selfHeal();
                break;
            case 'compromise':
                this.markCompromised();
                break;
        }
    }

    killSession() {
        this.isCompromised = true;
        document.cookie.split(";").forEach(c => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos) : c;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
        sessionStorage.clear();
        window.location.replace('/');
    }

    redirectTrap() {
        const trapUrls = [
            '/fake-admin',
            '/honeypot',
            '/debug-trap',
            '/security-alert'
        ];
        
        const trapUrl = trapUrls[Math.floor(Math.random() * trapUrls.length)];
        window.location.replace(trapUrl);
    }

    floodCpu(severity = 'medium') {
        const intensities = {
            low: 10000,
            medium: 100000,
            high: 1000000
        };
        
        const iterations = intensities[severity] || intensities.medium;
        
        setTimeout(() => {
            for (let i = 0; i < iterations; i++) {
                Math.sqrt(Math.random() * Math.random());
            }
        }, Math.random() * 5000);
    }

    randomFreeze() {
        const delay = Math.random() * 3000 + 1000;
        const start = Date.now();
        while (Date.now() - start < delay) {
            // Blocking freeze
        }
    }

    activateDiversion() {
        // Replace real data with fake data
        Object.defineProperty(window, 'API_KEY', {
            value: 'fake_api_key_' + Math.random().toString(36),
            writable: false
        });
        
        // Fake server responses
        const originalFetch = this.originalFunctions.get('fetch');
        if (originalFetch) {
            window.fetch = async (...args) => {
                const response = await originalFetch.apply(this, args);
                if (args[0].includes('/api/')) {
                    return new Response(JSON.stringify({ fake: 'data' }));
                }
                return response;
            };
        }
    }

    selfHeal() {
        // Attempt to restore original functions
        this.originalFunctions.forEach((originalFunc, path) => {
            const obj = this.getObjectByPath(path);
            if (obj.target && obj.property) {
                try {
                    obj.target[obj.property] = originalFunc;
                } catch (e) {
                    // Silent fail
                }
            }
        });
        
        // Regenerate polymorphic code
        this.mutateCode();
    }

    markCompromised() {
        this.isCompromised = true;
        console.log('%c🚨 SECURITY BREACH DETECTED 🚨', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cSystem is compromised. All operations suspended.', 'color: red; font-size: 14px;');
    }

    async fetchServerConfig() {
        try {
            const response = await fetch(`${this.config.serverEndpoint}/config?clientId=${this.config.clientId}`);
            if (response.ok) {
                const newConfig = await response.json();
                Object.assign(this.config, newConfig);
            }
        } catch (e) {
            // Use default config
        }
    }

    setupEventListeners() {
        // Detect context menu (right-click)
        document.addEventListener('contextmenu', (e) => {
            if (this.config.blockRightClick) {
                e.preventDefault();
                this.reportDetection('right_click_blocked', 'Right-click attempted');
            }
        });
        
        // Detect key combinations
        document.addEventListener('keydown', (e) => {
            const forbidden = [
                { key: 'F12' },
                { key: 'I', ctrl: true, shift: true },
                { key: 'J', ctrl: true, shift: true },
                { key: 'C', ctrl: true, shift: true },
                { key: 'U', ctrl: true }
            ];
            
            forbidden.forEach(combo => {
                if (e.key === combo.key && 
                    (!combo.ctrl || e.ctrlKey) && 
                    (!combo.shift || e.shiftKey)) {
                    e.preventDefault();
                    this.reportDetection('forbidden_key', `Key combination blocked: ${combo.key}`);
                }
            });
        });
        
        // Detect page visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.reportDetection('tab_hidden', 'Tab became hidden');
            }
        });
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AntidebugCore;
}

// Global initialization
window.AntidebugCore = AntidebugCore;