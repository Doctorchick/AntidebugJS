/**
 * AntidebugJS++ v4.0.0 - Military Grade Anti-Debug System
 * Reorganized architecture with centralized configuration
 * 
 * Usage:
 * <script src="antidebug-plus-v4.bundle.js"></script>
 * <script>
 *   const antidebug = new AntidebugJS({
 *     serverEndpoint: '/api/antidebug',
 *     clientId: 'my-app',
 *     aggressiveMode: true,
 *     enableBlockInspect: true
 *   });
 * </script>
 */

(function(global, factory) {
    'use strict';
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global.AntidebugJS = factory();
    }
})(typeof window !== 'undefined' ? window : this, function() {
    'use strict';
    
    // ========================================
    // CONFIGURATION & CONSTANTS
    // ========================================
    
    const DEFAULT_CONFIG = {
        // Server communication
        serverEndpoint: '/api/antidebug',
        clientId: 'default',
        
        // Protection modes
        aggressiveMode: true,
        stealthMode: true,
        enableWasm: true,
        enableFingerprinting: true,
        enableBlockInspect: true,
        
        // BlockInspect specific settings
        blockInspectConfig: {
            destroyUrl: 'https://www.kurugane.com/error.html',
            blurEffect: true,
            windowSizeThreshold: 150,
            consoleTimingThreshold: 50,
            debuggerTimingThreshold: 50,
            checkInterval: 500,
            consoleCheckInterval: 1000,
            debuggerCheckInterval: 1000
        },
        
        // Behavioral settings
        blockRightClick: true,
        blockKeyboardShortcuts: true,
        blockTextSelection: true,
        preventErrorDisplay: true,
        
        // Detection intervals
        mutationInterval: 30000,
        checkInterval: 5000,
        
        // Security thresholds
        maxDetections: 10,
        performanceThreshold: 100,
        
        // Auto-start
        autoStart: true,
        
        // Callbacks
        onDetection: null,
        onCompromised: null,
        onError: null,
        onBlockInspectTrigger: null,
        
        // Countermeasures
        safeRedirectUrl: '/',
        enableCountermeasures: true
    };
    
    const THREAT_SIGNATURES = {
        // Injection tools
        INJECTION_TOOLS: [
            'GM_info', 'GM_setValue', 'GM_getValue', 'unsafeWindow', 'GM_xmlhttpRequest',
            'GM_addStyle', 'GM_getResourceText', 'GM_getResourceURL', 'GM_notification',
            'chrome.extension', 'chrome.runtime', 'browser.extension', 'browser.runtime',
            'moz-extension', 'chrome-extension', 'safari-extension'
        ],
        
        // Automation tools
        AUTOMATION_TOOLS: [
            '__nightmare', '__phantomjs', '__selenium', 'webdriver', '_Selenium_IDE_Recorder',
            'callSelenium', '_selenium', 'callPhantom', '_phantom', 'spawn', 'emit', 'Buffer'
        ],
        
        // Suspicious user agents
        SUSPICIOUS_UA: ['headless', 'phantom', 'selenium', 'nightmare', 'puppeteer'],
        
        // VM indicators
        VM_RESOLUTIONS: ['1024x768', '1152x864', '1280x800', '1280x1024', '1400x1050'],
        
        // Key combinations to block
        FORBIDDEN_KEYS: [
            { key: 'F12' },
            { key: 'I', ctrl: true, shift: true },
            { key: 'J', ctrl: true, shift: true },
            { key: 'C', ctrl: true, shift: true },
            { key: 'U', ctrl: true },
            { key: 'S', ctrl: true }
        ]
    };
    
    const COUNTERMEASURE_ACTIONS = {
        SESSION_KILL: 'session_kill',
        REDIRECT_TRAP: 'redirect_trap',
        CPU_FLOOD: 'cpu_flood',
        FREEZE: 'freeze',
        DIVERSION: 'diversion',
        SELF_HEAL: 'self_heal',
        COMPROMISE: 'compromise',
        BLOCK_INSPECT: 'block_inspect'
    };
    
    const SEVERITY_LEVELS = {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        CRITICAL: 'critical'
    };
    
    // ========================================
    // CRYPTO UTILITIES
    // ========================================
    
    const CryptoUtils = {
        key: null,
        
        generateKey() {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substring(2);
            this.key = btoa(timestamp + random).replace(/[^a-zA-Z0-9]/g, '');
            return this.key;
        },
        
        encrypt(data) {
            if (!this.key) this.generateKey();
            
            let encrypted = '';
            for (let i = 0; i < data.length; i++) {
                const keyChar = this.key.charCodeAt(i % this.key.length);
                const dataChar = data.charCodeAt(i);
                encrypted += String.fromCharCode(dataChar ^ keyChar);
            }
            return btoa(encrypted);
        },
        
        decrypt(encrypted) {
            if (!this.key) return null;
            
            const data = atob(encrypted);
            let decrypted = '';
            for (let i = 0; i < data.length; i++) {
                const keyChar = this.key.charCodeAt(i % this.key.length);
                const dataChar = data.charCodeAt(i);
                decrypted += String.fromCharCode(dataChar ^ keyChar);
            }
            return decrypted;
        },
        
        hash(str) {
            let hash = 0;
            if (str.length === 0) return hash;
            
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            
            return Math.abs(hash).toString(36);
        }
    };
    
    // ========================================
    // BLOCK INSPECT MODULE
    // ========================================
    
    const BlockInspectModule = {
        detected: false,
        config: null,
        callbacks: {},
        
        init(config, callbacks = {}) {
            this.config = config;
            this.callbacks = callbacks;
            this.deploy();
        },
        
        deploy() {
            if (!this.config.enableBlockInspect) return;
            
            this.setupEventListeners();
            this.startMonitoring();
        },
        
        destroyPage() {
            if (this.detected) return;
            this.detected = true;
            
            // Trigger callback
            if (this.callbacks.onTrigger) {
                this.callbacks.onTrigger('block_inspect_triggered', 'Page destruction initiated');
            }
            
            // Apply blur effect
            if (this.config.blockInspectConfig.blurEffect) {
                document.body.style.filter = 'blur(20px)';
                document.body.style.transition = 'filter 0.3s ease';
            }
            
            // Clear content
            setTimeout(() => {
                document.body.innerHTML = '';
            }, 100);
            
            // Redirect
            setTimeout(() => {
                window.location.href = this.config.blockInspectConfig.destroyUrl;
            }, 200);
        },
        
        checkWindowSize() {
            const threshold = this.config.blockInspectConfig.windowSizeThreshold;
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                this.destroyPage();
            }
        },
        
        checkConsole() {
            const start = Date.now();
            console.log('%c', 'color: transparent');
            if (Date.now() - start > this.config.blockInspectConfig.consoleTimingThreshold) {
                this.destroyPage();
            }
        },
        
        checkDebugger() {
            const start = Date.now();
            debugger;
            if (Date.now() - start > this.config.blockInspectConfig.debuggerTimingThreshold) {
                this.destroyPage();
            }
        },
        
        setupEventListeners() {
            // Disable right-click
            if (this.config.blockRightClick) {
                document.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.destroyPage();
                });
            }
            
            // Disable keyboard shortcuts
            if (this.config.blockKeyboardShortcuts) {
                document.addEventListener('keydown', (e) => {
                    const forbidden = THREAT_SIGNATURES.FORBIDDEN_KEYS.some(combo => 
                        e.key === combo.key && 
                        (!combo.ctrl || e.ctrlKey) && 
                        (!combo.shift || e.shiftKey) &&
                        (!combo.alt || e.altKey)
                    );
                    
                    if (forbidden) {
                        e.preventDefault();
                        this.destroyPage();
                    }
                });
            }
            
            // Prevent text selection
            if (this.config.blockTextSelection) {
                document.addEventListener('selectstart', (e) => {
                    e.preventDefault();
                });
            }
            
            // Hide errors
            if (this.config.preventErrorDisplay) {
                window.addEventListener('error', (e) => {
                    e.preventDefault();
                    return true;
                });
            }
        },
        
        startMonitoring() {
            // Window size monitoring
            setInterval(() => this.checkWindowSize(), this.config.blockInspectConfig.checkInterval);
            
            // Console monitoring
            setInterval(() => this.checkConsole(), this.config.blockInspectConfig.consoleCheckInterval);
            
            // Debugger monitoring
            setInterval(() => this.checkDebugger(), this.config.blockInspectConfig.debuggerCheckInterval);
        },
        
        stop() {
            this.detected = false;
            // Note: Intervals would need to be stored to be cleared properly
        }
    };
    
    // ========================================
    // FINGERPRINTING ENGINE
    // ========================================
    
    const FingerprintEngine = {
        async generate() {
            const components = await Promise.all([
                this.getCanvasFingerprint(),
                this.getWebGLFingerprint(),
                this.getAudioFingerprint(),
                this.getFontFingerprint(),
                this.getScreenFingerprint(),
                this.getTimezoneFingerprint(),
                this.getPluginsFingerprint(),
                this.getLanguageFingerprint()
            ]);
            
            const combined = components.join('|');
            return CryptoUtils.hash(combined);
        },
        
        getCanvasFingerprint() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                ctx.textBaseline = 'alphabetic';
                ctx.fillStyle = '#f60';
                ctx.fillRect(125, 1, 62, 20);
                
                ctx.fillStyle = '#069';
                ctx.font = '11pt Arial';
                ctx.fillText('AntidebugJS++ v4.0.0 fingerprint', 2, 15);
                
                ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
                ctx.font = '18pt Arial';
                ctx.fillText('🛡️🔒💻', 4, 45);
                
                return canvas.toDataURL();
            } catch (e) {
                return 'canvas_blocked';
            }
        },
        
        getWebGLFingerprint() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl2') || 
                          canvas.getContext('webgl') || 
                          canvas.getContext('experimental-webgl');
                
                if (!gl) return 'webgl_not_supported';
                
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                const vendor = gl.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL || gl.VENDOR);
                const renderer = gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL || gl.RENDERER);
                
                return `${vendor}|${renderer}|${gl.getSupportedExtensions().join(',')}`;
            } catch (e) {
                return 'webgl_error';
            }
        },
        
        async getAudioFingerprint() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const analyser = audioContext.createAnalyser();
                const gainNode = audioContext.createGain();
                const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
                
                oscillator.type = 'triangle';
                oscillator.frequency.value = 10000;
                gainNode.gain.value = 0;
                
                oscillator.connect(analyser);
                analyser.connect(scriptProcessor);
                scriptProcessor.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.start();
                
                return new Promise((resolve) => {
                    let samples = [];
                    scriptProcessor.onaudioprocess = (event) => {
                        const buffer = event.inputBuffer.getChannelData(0);
                        for (let i = 0; i < buffer.length; i += 100) {
                            samples.push(Math.abs(buffer[i]));
                        }
                        
                        if (samples.length >= 30) {
                            oscillator.stop();
                            audioContext.close();
                            resolve(samples.slice(0, 30).join(''));
                        }
                    };
                    
                    setTimeout(() => resolve('audio_timeout'), 1000);
                });
            } catch (e) {
                return 'audio_blocked';
            }
        },
        
        getFontFingerprint() {
            const testString = 'mmmmmmmmmmlli';
            const testSize = '72px';
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const baseFonts = ['monospace', 'sans-serif', 'serif'];
            const testFonts = [
                'Arial', 'Arial Black', 'Arial Unicode MS', 'Comic Sans MS',
                'Courier New', 'Georgia', 'Helvetica', 'Impact', 'Lucida Console',
                'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'
            ];
            
            const baselines = baseFonts.map(font => {
                ctx.font = `${testSize} ${font}`;
                return ctx.measureText(testString).width;
            });
            
            const detected = testFonts.filter((font, index) => {
                ctx.font = `${testSize} ${font}, ${baseFonts[index % baseFonts.length]}`;
                const width = ctx.measureText(testString).width;
                return width !== baselines[index % baselines.length];
            });
            
            return detected.join(',');
        },
        
        getScreenFingerprint() {
            return [
                screen.width, screen.height, screen.colorDepth,
                screen.pixelDepth, window.devicePixelRatio || 1,
                window.innerWidth, window.innerHeight,
                screen.availWidth, screen.availHeight
            ].join('|');
        },
        
        getTimezoneFingerprint() {
            const date = new Date();
            return [
                date.getTimezoneOffset(),
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                date.getFullYear()
            ].join('|');
        },
        
        getPluginsFingerprint() {
            const plugins = Array.from(navigator.plugins).map(plugin => 
                `${plugin.name}|${plugin.version || ''}`
            );
            return plugins.join(';');
        },
        
        getLanguageFingerprint() {
            return [
                navigator.language,
                navigator.languages.join(','),
                navigator.userAgent.length
            ].join('|');
        }
    };
    
    // ========================================
    // WEBASSEMBLY PROTECTION
    // ========================================
    
    const WasmProtection = {
        module: null,
        
        async init() {
            const wasmCode = new Uint8Array([
                0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
                0x01, 0x0c, 0x02, 0x60, 0x02, 0x7f, 0x7f, 0x01,
                0x7f, 0x60, 0x01, 0x7f, 0x01, 0x7f, 0x03, 0x03,
                0x02, 0x00, 0x01, 0x07, 0x14, 0x02, 0x03, 0x78,
                0x6f, 0x72, 0x00, 0x00, 0x08, 0x66, 0x69, 0x62,
                0x6f, 0x6e, 0x61, 0x63, 0x63, 0x69, 0x00, 0x01,
                0x0a, 0x20, 0x02, 0x0e, 0x00, 0x20, 0x00, 0x20,
                0x01, 0x73, 0x0b, 0x10, 0x00, 0x20, 0x00, 0x41,
                0x02, 0x49, 0x04, 0x40, 0x20, 0x00, 0x0f, 0x0b,
                0x41, 0x00, 0x0b
            ]);
            
            try {
                this.module = await WebAssembly.instantiate(wasmCode);
                return true;
            } catch (e) {
                return false;
            }
        },
        
        xor(a, b) {
            return this.module ? this.module.instance.exports.xor(a, b) : a ^ b;
        },
        
        fibonacci(n) {
            if (this.module) {
                return this.module.instance.exports.fibonacci(n);
            }
            
            if (n < 2) return n;
            let a = 0, b = 1;
            for (let i = 2; i <= n; i++) {
                [a, b] = [b, a + b];
            }
            return b;
        }
    };
    
    // ========================================
    // DETECTION ENGINE
    // ========================================
    
    const DetectionEngine = {
        async detectDevToolsAdvanced() {
            const checks = [];
            
            // Timing-based detection
            const start = performance.now();
            debugger;
            const end = performance.now();
            checks.push({ 
                type: 'timing', 
                value: end - start, 
                threshold: 100,
                suspicious: (end - start) > 100
            });
            
            // Console detection via toString
            let consoleDetected = false;
            const element = document.createElement('div');
            Object.defineProperty(element, 'id', {
                get() {
                    consoleDetected = true;
                    return 'devtools-detected';
                }
            });
            console.log(element);
            console.clear();
            checks.push({ type: 'console_toString', value: consoleDetected, suspicious: consoleDetected });
            
            // Window dimension analysis
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            checks.push({ 
                type: 'dimensions', 
                value: { width: widthDiff, height: heightDiff },
                suspicious: widthDiff > 200 || heightDiff > 200
            });
            
            // Function integrity check
            const originalToString = Function.prototype.toString;
            const testFunc = function() { return 42; };
            const funcString = originalToString.call(testFunc);
            checks.push({
                type: 'function_integrity',
                value: funcString.length,
                suspicious: !funcString.includes('return 42')
            });
            
            // Memory usage analysis
            if (performance.memory) {
                const memInfo = performance.memory;
                checks.push({
                    type: 'memory',
                    value: memInfo,
                    suspicious: memInfo.usedJSHeapSize > memInfo.totalJSHeapSize * 0.8
                });
            }
            
            return checks;
        },
        
        detectInjectionTools() {
            const detected = [];
            
            THREAT_SIGNATURES.INJECTION_TOOLS.forEach(signature => {
                try {
                    if (window[signature] !== undefined) {
                        detected.push({ 
                            type: 'global_property', 
                            signature, 
                            value: typeof window[signature],
                            suspicious: true
                        });
                    }
                    
                    if (document.documentElement.getAttribute(signature)) {
                        detected.push({ 
                            type: 'dom_attribute', 
                            signature, 
                            value: true,
                            suspicious: true
                        });
                    }
                } catch (e) {
                    detected.push({ 
                        type: 'access_error', 
                        signature, 
                        error: e.message,
                        suspicious: true
                    });
                }
            });
            
            // Check for modified native functions
            const nativeFunctions = [
                { obj: window, prop: 'fetch' },
                { obj: window, prop: 'XMLHttpRequest' },
                { obj: document, prop: 'createElement' },
                { obj: console, prop: 'log' }
            ];
            
            nativeFunctions.forEach(({ obj, prop }) => {
                try {
                    const func = obj[prop];
                    if (func && typeof func === 'function') {
                        const funcStr = func.toString();
                        if (!funcStr.includes('[native code]')) {
                            detected.push({ 
                                type: 'modified_native', 
                                property: prop, 
                                suspicious: true
                            });
                        }
                    }
                } catch (e) {
                    detected.push({ 
                        type: 'native_check_error', 
                        property: prop, 
                        error: e.message,
                        suspicious: true
                    });
                }
            });
            
            return detected;
        },
        
        detectVirtualEnvironment() {
            const checks = [];
            
            // Screen resolution analysis
            const currentRes = `${screen.width}x${screen.height}`;
            checks.push({
                type: 'vm_resolution',
                value: currentRes,
                suspicious: THREAT_SIGNATURES.VM_RESOLUTIONS.includes(currentRes)
            });
            
            // Hardware concurrency
            checks.push({
                type: 'cpu_cores',
                value: navigator.hardwareConcurrency,
                suspicious: navigator.hardwareConcurrency <= 2
            });
            
            // Memory constraints
            if (navigator.deviceMemory) {
                checks.push({
                    type: 'device_memory',
                    value: navigator.deviceMemory,
                    suspicious: navigator.deviceMemory < 4
                });
            }
            
            // Plugin analysis
            checks.push({
                type: 'plugins_count',
                value: navigator.plugins.length,
                suspicious: navigator.plugins.length === 0
            });
            
            // WebGL vendor analysis
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            if (gl) {
                const vendor = gl.getParameter(gl.VENDOR);
                const renderer = gl.getParameter(gl.RENDERER);
                checks.push({
                    type: 'webgl_vendor',
                    vendor, renderer,
                    suspicious: vendor.includes('VMware') || renderer.includes('llvmpipe')
                });
            }
            
            return checks;
        },
        
        detectAutomation() {
            const checks = [];
            
            // Webdriver detection
            checks.push({
                type: 'webdriver_property',
                detected: navigator.webdriver === true,
                suspicious: navigator.webdriver === true
            });
            
            // Automation properties
            THREAT_SIGNATURES.AUTOMATION_TOOLS.forEach(prop => {
                if (window[prop]) {
                    checks.push({
                        type: 'automation_property',
                        property: prop,
                        detected: true,
                        suspicious: true
                    });
                }
            });
            
            // User agent analysis
            const userAgent = navigator.userAgent.toLowerCase();
            THREAT_SIGNATURES.SUSPICIOUS_UA.forEach(pattern => {
                if (userAgent.includes(pattern)) {
                    checks.push({
                        type: 'suspicious_useragent',
                        pattern,
                        detected: true,
                        suspicious: true
                    });
                }
            });
            
            return checks;
        }
    };
    
    // ========================================
    // MAIN ANTIDEBUGJS CLASS
    // ========================================
    
    class AntidebugJS {
        constructor(userConfig = {}) {
            // Merge user config with defaults
            this.config = this.mergeConfig(DEFAULT_CONFIG, userConfig);
            
            // Initialize state
            this.state = {
                sessionId: this.generateSessionId(),
                fingerprint: '',
                isActive: false,
                isCompromised: false,
                detectionCount: 0,
                startTime: Date.now(),
                lastMutation: Date.now()
            };
            
            // Initialize collections
            this.detectionHistory = [];
            this.originalFunctions = new Map();
            this.protectedModules = new Map();
            this.intervals = new Set();
            this.eventListeners = new Map();
            
            // Auto-start if configured
            if (this.config.autoStart) {
                this.init();
            }
        }
        
        mergeConfig(defaults, userConfig) {
            const merged = { ...defaults };
            
            Object.keys(userConfig).forEach(key => {
                if (typeof userConfig[key] === 'object' && 
                    userConfig[key] !== null && 
                    !Array.isArray(userConfig[key])) {
                    merged[key] = { ...defaults[key], ...userConfig[key] };
                } else {
                    merged[key] = userConfig[key];
                }
            });
            
            return merged;
        }
        
        async init() {
            if (this.state.isActive) return;
            
            try {
                // Initialize core components
                await this.initializeComponents();
                
                // Initialize BlockInspect module
                BlockInspectModule.init(this.config, {
                    onTrigger: (type, details) => {
                        this.reportDetection(type, details);
                        if (this.config.onBlockInspectTrigger) {
                            this.config.onBlockInspectTrigger(type, details);
                        }
                    }
                });
                
                // Start protection systems
                this.backupOriginalFunctions();
                this.deployHoneypots();
                this.startProtectionLoop();
                this.setupEventListeners();
                this.startPolymorphicEngine();
                
                // Fetch server configuration
                await this.fetchServerConfig();
                
                this.state.isActive = true;
                this.log('AntidebugJS++ v4.0.0 initialized successfully');
                
            } catch (error) {
                this.handleError('Initialization failed', error);
            }
        }
        
        async initializeComponents() {
            const tasks = [];
            
            // Initialize WebAssembly
            if (this.config.enableWasm) {
                tasks.push(WasmProtection.init().then(success => {
                    if (!success) this.reportDetection('wasm_init_failed', 'WebAssembly initialization blocked');
                }));
            }
            
            // Generate fingerprint
            if (this.config.enableFingerprinting) {
                tasks.push(FingerprintEngine.generate().then(fp => {
                    this.state.fingerprint = fp;
                }));
            }
            
            // Initialize crypto
            CryptoUtils.generateKey();
            
            await Promise.all(tasks);
        }
        
        generateSessionId() {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substring(2);
            const entropy = (performance.now() * Math.random()).toString(36);
            return btoa(`${timestamp}-${random}-${entropy}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
        }
        
        backupOriginalFunctions() {
            const criticalFunctions = [
                { path: 'console.log', obj: console, prop: 'log' },
                { path: 'console.warn', obj: console, prop: 'warn' },
                { path: 'console.error', obj: console, prop: 'error' },
                { path: 'Function.prototype.toString', obj: Function.prototype, prop: 'toString' },
                { path: 'Object.defineProperty', obj: Object, prop: 'defineProperty' },
                { path: 'performance.now', obj: performance, prop: 'now' },
                { path: 'Date.now', obj: Date, prop: 'now' },
                { path: 'fetch', obj: window, prop: 'fetch' },
                { path: 'XMLHttpRequest', obj: window, prop: 'XMLHttpRequest' }
            ];
            
            criticalFunctions.forEach(({ path, obj, prop }) => {
                if (obj && obj[prop]) {
                    this.originalFunctions.set(path, obj[prop]);
                }
            });
        }
        
        deployHoneypots() {
            // Deploy fake sensitive data
            const fakeData = {
                '__API_KEY__': 'fake_' + Math.random().toString(36),
                '__SESSION_TOKEN__': 'fake_token_' + Math.random().toString(36),
                '__DEBUG_MODE__': false,
                '__ADMIN_PANEL__': '/fake-admin',
                'getSecretKey': () => {
                    this.reportDetection('honeypot_triggered', 'Fake secret key accessed');
                    return 'fake_secret_' + Math.random().toString(36);
                }
            };
            
            Object.keys(fakeData).forEach(key => {
                try {
                    Object.defineProperty(window, key, {
                        get: () => {
                            this.reportDetection('honeypot_accessed', `Honeypot ${key} accessed`);
                            return fakeData[key];
                        },
                        set: () => {
                            this.reportDetection('honeypot_modified', `Honeypot ${key} modification attempted`);
                        },
                        configurable: false,
                        enumerable: false
                    });
                } catch (e) {
                    // Silent fail
                }
            });
            
            // Console trap
            this.setupConsoleTrap();
        }
        
        setupConsoleTrap() {
            const originalConsole = this.originalFunctions.get('console.log');
            if (!originalConsole) return;
            
            let consoleAccessed = false;
            
            Object.defineProperty(console, '__accessed', {
                get: () => {
                    if (!consoleAccessed) {
                        consoleAccessed = true;
                        this.reportDetection('console_accessed', 'Console object accessed');
                    }
                    return true;
                },
                configurable: false
            });
            
            // Intercept console methods
            ['log', 'warn', 'error', 'debug', 'info'].forEach(method => {
                const original = console[method];
                console[method] = (...args) => {
                    console.__accessed; // Trigger detection
                    return original.apply(console, args);
                };
            });
        }
        
        startProtectionLoop() {
            const runDetectionCycle = async () => {
                if (this.state.isCompromised) return;
                
                try {
                    // Run all detection algorithms
                    const [devToolsResults, injectionResults, vmResults, automationResults] = await Promise.all([
                        DetectionEngine.detectDevToolsAdvanced(),
                        Promise.resolve(DetectionEngine.detectInjectionTools()),
                        Promise.resolve(DetectionEngine.detectVirtualEnvironment()),
                        Promise.resolve(DetectionEngine.detectAutomation())
                    ]);
                    
                    // Process results
                    this.processDetectionResults('devtools', devToolsResults);
                    this.processDetectionResults('injection', injectionResults);
                    this.processDetectionResults('vm', vmResults);
                    this.processDetectionResults('automation', automationResults);
                    
                    // Additional custom checks
                    this.checkCodeIntegrity();
                    this.checkPerformanceThrottling();
                    
                } catch (error) {
                    this.handleError('Detection cycle failed', error);
                }
            };
            
            // Initial run
            runDetectionCycle();
            
            // Schedule regular runs with jitter
            const scheduleNext = () => {
                const jitter = Math.random() * 2000; // 0-2 second jitter
                const interval = this.config.checkInterval + jitter;
                
                const timeoutId = setTimeout(() => {
                    runDetectionCycle();
                    scheduleNext();
                }, interval);
                
                this.intervals.add(timeoutId);
            };
            
            scheduleNext();
        }
        
        processDetectionResults(category, results) {
            results.forEach(result => {
                if (result.suspicious || result.detected || result.value > (result.threshold || 0)) {
                    this.reportDetection(`${category}_${result.type}`, JSON.stringify(result));
                }
            });
        }
        
        checkCodeIntegrity() {
            // Check if critical functions have been modified
            this.originalFunctions.forEach((originalFunc, path) => {
                const current = this.getFunctionByPath(path);
                if (current && current.toString() !== originalFunc.toString()) {
                    this.reportDetection('code_integrity_violation', `Function ${path} was modified`);
                }
            });
            
            // Check script tags for modifications
            const scripts = document.querySelectorAll('script[src]');
            scripts.forEach(script => {
                if (script.src.includes('antidebug') && script.dataset.integrity) {
                    this.reportDetection('script_integrity_check', `Script integrity verified: ${script.src}`);
                }
            });
        }
        
        checkPerformanceThrottling() {
            const iterations = 100000;
            const start = performance.now();
            
            for (let i = 0; i < iterations; i++) {
                Math.random() * Math.random();
            }
            
            const elapsed = performance.now() - start;
            const expectedTime = 50;
            
            if (elapsed > expectedTime * 2) {
                this.reportDetection('performance_throttling', `Execution time: ${elapsed}ms (expected: ~${expectedTime}ms)`);
            }
        }
        
        getFunctionByPath(path) {
            const parts = path.split('.');
            let current = window;
            
            for (const part of parts) {
                current = current[part];
                if (!current) return null;
            }
            
            return current;
        }
        
        setupEventListeners() {
            // Mouse movement analysis for automation detection
            let mouseEvents = 0;
            const mouseListener = () => mouseEvents++;
            document.addEventListener('mousemove', mouseListener);
            this.eventListeners.set('mousemove', mouseListener);
            
            setTimeout(() => {
                this.reportDetection('mouse_activity', `Mouse events: ${mouseEvents}`);
            }, 5000);
            
            // Page visibility changes
            const visibilityListener = () => {
                if (document.hidden) {
                    this.reportDetection('page_hidden', 'Page became hidden (possible tab switching)');
                }
            };
            
            document.addEventListener('visibilitychange', visibilityListener);
            this.eventListeners.set('visibilitychange', visibilityListener);
            
            // Window focus changes
            const focusListener = () => {
                this.reportDetection('window_focus_lost', 'Window lost focus');
            };
            
            window.addEventListener('blur', focusListener);
            this.eventListeners.set('blur', focusListener);
        }
        
        startPolymorphicEngine() {
            const mutate = () => {
                if (this.state.isCompromised) return;
                
                try {
                    // Generate and execute polymorphic code
                    const code = this.generatePolymorphicCode();
                    const encrypted = CryptoUtils.encrypt(code);
                    
                    setTimeout(() => {
                        const decrypted = CryptoUtils.decrypt(encrypted);
                        if (decrypted) {
                            eval(decrypted);
                        }
                    }, Math.random() * 1000);
                    
                    this.state.lastMutation = Date.now();
                } catch (error) {
                    this.reportDetection('polymorphic_execution_blocked', 'Polymorphic code execution was blocked');
                }
            };
            
            // Initial mutation
            mutate();
            
            // Schedule regular mutations
            const intervalId = setInterval(mutate, this.config.mutationInterval);
            this.intervals.add(intervalId);
        }
        
        generatePolymorphicCode() {
            const templates = [
                () => `const ${this.randomIdentifier()} = ${Math.random()};`,
                () => `function ${this.randomIdentifier()}() { return ${Math.random()} * ${Math.random()}; }`,
                () => `const ${this.randomIdentifier()} = () => Math.abs(${Math.random()} - ${Math.random()});`,
                () => `if (${Math.random()} > 0.5) { const ${this.randomIdentifier()} = Date.now(); }`,
                () => `try { ${this.randomIdentifier()}(); } catch (e) { /* ${Math.random()} */ }`
            ];
            
            const template = templates[Math.floor(Math.random() * templates.length)];
            return template();
        }
        
        randomIdentifier() {
            const prefixes = ['tmp', 'var', 'fn', 'obj', 'val', 'ref'];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const suffix = Math.random().toString(36).substring(2, 8);
            return `${prefix}_${suffix}`;
        }
        
        async fetchServerConfig() {
            try {
                const response = await fetch(`${this.config.serverEndpoint}/config?clientId=${this.config.clientId}`);
                
                if (response.ok) {
                    const serverConfig = await response.json();
                    Object.assign(this.config, serverConfig);
                    this.log('Server configuration updated', serverConfig);
                }
            } catch (error) {
                this.log('Failed to fetch server configuration, using defaults');
            }
        }
        
        async reportDetection(type, details) {
            this.state.detectionCount++;
            
            const detection = {
                sessionId: this.state.sessionId,
                clientId: this.config.clientId,
                type,
                details,
                timestamp: Date.now(),
                fingerprint: this.state.fingerprint,
                url: window.location.href,
                userAgent: navigator.userAgent,
                detectionCount: this.state.detectionCount,
                uptime: Date.now() - this.state.startTime
            };
            
            this.detectionHistory.push(detection);
            
            // Trigger custom callback
            if (this.config.onDetection) {
                try {
                    this.config.onDetection(detection);
                } catch (error) {
                    this.handleError('onDetection callback failed', error);
                }
            }
            
            // Report to server if enabled
            if (this.config.enableCountermeasures) {
                try {
                    const response = await fetch(`${this.config.serverEndpoint}/report`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(detection)
                    });
                    
                    if (response.ok) {
                        const action = await response.json();
                        this.executeCountermeasure(action);
                    }
                } catch (error) {
                    // Fallback to local countermeasures
                    this.executeCountermeasure(this.determineLocalCountermeasure(type));
                }
            }
            
            // Check if maximum detections reached
            if (this.state.detectionCount >= this.config.maxDetections) {
                this.executeCountermeasure({ action: COUNTERMEASURE_ACTIONS.COMPROMISE, severity: SEVERITY_LEVELS.CRITICAL });
            }
        }
        
        determineLocalCountermeasure(type) {
            const severity = this.getThreatSeverity(type);
            
            switch (severity) {
                case SEVERITY_LEVELS.HIGH:
                    return { action: COUNTERMEASURE_ACTIONS.REDIRECT_TRAP, severity };
                case SEVERITY_LEVELS.MEDIUM:
                    return { action: COUNTERMEASURE_ACTIONS.CPU_FLOOD, severity };
                default:
                    return { action: COUNTERMEASURE_ACTIONS.FREEZE, severity: SEVERITY_LEVELS.LOW };
            }
        }
        
        getThreatSeverity(type) {
            const highThreats = ['injection', 'tampermonkey', 'code_integrity', 'automation', 'block_inspect'];
            const mediumThreats = ['devtools', 'console', 'vm'];
            
            for (const threat of highThreats) {
                if (type.includes(threat)) return SEVERITY_LEVELS.HIGH;
            }
            
            for (const threat of mediumThreats) {
                if (type.includes(threat)) return SEVERITY_LEVELS.MEDIUM;
            }
            
            return SEVERITY_LEVELS.LOW;
        }
        
        executeCountermeasure(action) {
            if (!action || this.state.isCompromised) return;
            
            this.log(`Executing countermeasure: ${action.action} (${action.severity})`);
            
            switch (action.action) {
                case COUNTERMEASURE_ACTIONS.SESSION_KILL:
                    this.killSession();
                    break;
                case COUNTERMEASURE_ACTIONS.REDIRECT_TRAP:
                    this.redirectToTrap();
                    break;
                case COUNTERMEASURE_ACTIONS.CPU_FLOOD:
                    this.floodCpu(action.severity);
                    break;
                case COUNTERMEASURE_ACTIONS.FREEZE:
                    this.freezeExecution();
                    break;
                case COUNTERMEASURE_ACTIONS.DIVERSION:
                    this.activateDiversion();
                    break;
                case COUNTERMEASURE_ACTIONS.SELF_HEAL:
                    this.selfHeal();
                    break;
                case COUNTERMEASURE_ACTIONS.COMPROMISE:
                    this.markAsCompromised();
                    break;
                case COUNTERMEASURE_ACTIONS.BLOCK_INSPECT:
                    BlockInspectModule.destroyPage();
                    break;
            }
        }
        
        killSession() {
            this.log('Killing session - security breach detected');
            
            // Clear all storage
            try {
                sessionStorage.clear();
                localStorage.clear();
            } catch (e) {}
            
            // Clear cookies
            document.cookie.split(";").forEach(c => {
                const eqPos = c.indexOf("=");
                const name = eqPos > -1 ? c.substr(0, eqPos) : c;
                document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            });
            
            // Redirect to safe page
            setTimeout(() => {
                window.location.replace(this.config.safeRedirectUrl);
            }, 100);
        }
        
        redirectToTrap() {
            const trapUrls = [
                '/security-alert',
                '/access-denied', 
                '/system-maintenance',
                '/honeypot-detected'
            ];
            
            const trapUrl = trapUrls[Math.floor(Math.random() * trapUrls.length)];
            window.location.replace(trapUrl);
        }
        
        floodCpu(severity = SEVERITY_LEVELS.MEDIUM) {
            const intensities = {
                [SEVERITY_LEVELS.LOW]: 50000,
                [SEVERITY_LEVELS.MEDIUM]: 500000,
                [SEVERITY_LEVELS.HIGH]: 2000000,
                [SEVERITY_LEVELS.CRITICAL]: 5000000
            };
            
            const iterations = intensities[severity] || intensities[SEVERITY_LEVELS.MEDIUM];
            const delay = Math.random() * 3000;
            
            setTimeout(() => {
                const start = Date.now();
                while (Date.now() - start < 1000) {
                    for (let i = 0; i < iterations; i++) {
                        Math.sqrt(Math.random() * Math.random());
                    }
                }
            }, delay);
        }
        
        freezeExecution() {
            const delay = Math.random() * 2000 + 500;
            const start = Date.now();
            
            while (Date.now() - start < delay) {
                // Blocking freeze
            }
        }
        
        activateDiversion() {
            this.log('Activating diversion mode');
            
            // Replace real APIs with fake ones
            const fakeApiResponses = {
                '/api/user': { id: 'fake_user', name: 'John Doe' },
                '/api/config': { debug: false, version: '1.0.0' },
                '/api/data': { message: 'This is fake data' }
            };
            
            // Override fetch
            const originalFetch = this.originalFunctions.get('fetch');
            if (originalFetch) {
                window.fetch = async (url, options) => {
                    for (const fakeUrl in fakeApiResponses) {
                        if (url.includes(fakeUrl)) {
                            return new Response(JSON.stringify(fakeApiResponses[fakeUrl]), {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }
                    return originalFetch(url, options);
                };
            }
        }
        
        selfHeal() {
            this.log('Attempting self-healing');
            
            // Restore original functions
            this.originalFunctions.forEach((originalFunc, path) => {
                try {
                    const parts = path.split('.');
                    let current = window;
                    
                    for (let i = 0; i < parts.length - 1; i++) {
                        current = current[parts[i]];
                        if (!current) return;
                    }
                    
                    current[parts[parts.length - 1]] = originalFunc;
                } catch (error) {
                    this.handleError(`Failed to restore ${path}`, error);
                }
            });
            
            // Regenerate crypto key
            CryptoUtils.generateKey();
            
            // Reset detection count
            this.state.detectionCount = Math.floor(this.state.detectionCount / 2);
        }
        
        markAsCompromised() {
            this.state.isCompromised = true;
            
            this.log('System marked as compromised - all protection disabled');
            
            // Clear all intervals
            this.intervals.forEach(id => clearInterval(id));
            this.intervals.clear();
            
            // Remove event listeners
            this.eventListeners.forEach((listener, event) => {
                document.removeEventListener(event, listener);
            });
            this.eventListeners.clear();
            
            // Stop BlockInspect module
            BlockInspectModule.stop();
            
            // Trigger custom callback
            if (this.config.onCompromised) {
                try {
                    this.config.onCompromised({
                        sessionId: this.state.sessionId,
                        detectionCount: this.state.detectionCount,
                        uptime: Date.now() - this.state.startTime
                    });
                } catch (error) {
                    this.handleError('onCompromised callback failed', error);
                }
            }
            
            // Display warning if not in stealth mode
            if (!this.config.stealthMode) {
                console.log('%c🚨 SECURITY BREACH DETECTED 🚨', 
                    'color: red; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
                console.log('%cSystem integrity compromised. All security measures have been disabled.', 
                    'color: red; font-size: 14px; font-weight: bold;');
            }
        }
        
        // ========================================
        // PUBLIC API METHODS
        // ========================================
        
        stop() {
            this.state.isActive = false;
            
            // Clear intervals
            this.intervals.forEach(id => clearInterval(id));
            this.intervals.clear();
            
            // Remove event listeners
            this.eventListeners.forEach((listener, event) => {
                document.removeEventListener(event, listener);
            });
            this.eventListeners.clear();
            
            // Stop BlockInspect module
            BlockInspectModule.stop();
            
            this.log('AntidebugJS++ v4.0.0 stopped');
        }
        
        getStatus() {
            return {
                isActive: this.state.isActive,
                isCompromised: this.state.isCompromised,
                detectionCount: this.state.detectionCount,
                uptime: Date.now() - this.state.startTime,
                sessionId: this.state.sessionId,
                fingerprint: this.state.fingerprint,
                version: '4.0.0'
            };
        }
        
        getDetectionHistory() {
            return [...this.detectionHistory];
        }
        
        updateConfig(newConfig) {
            this.config = this.mergeConfig(this.config, newConfig);
            this.log('Configuration updated', newConfig);
        }
        
        triggerManualDetection(type, details) {
            this.reportDetection(`manual_${type}`, details);
        }
        
        getConfig() {
            return { ...this.config };
        }
        
        // BlockInspect specific methods
        enableBlockInspect() {
            this.config.enableBlockInspect = true;
            BlockInspectModule.init(this.config, {
                onTrigger: (type, details) => {
                    this.reportDetection(type, details);
                    if (this.config.onBlockInspectTrigger) {
                        this.config.onBlockInspectTrigger(type, details);
                    }
                }
            });
        }
        
        disableBlockInspect() {
            this.config.enableBlockInspect = false;
            BlockInspectModule.stop();
        }
        
        // ========================================
        // UTILITY METHODS
        // ========================================
        
        log(...args) {
            if (!this.config.stealthMode && console && console.log) {
                console.log('[AntidebugJS++ v4.0.0]', ...args);
            }
        }
        
        handleError(message, error) {
            this.log(`ERROR: ${message}`, error);
            
            if (this.config.onError) {
                try {
                    this.config.onError(message, error);
                } catch (e) {
                    // Silent fail to prevent infinite loops
                }
            }
        }
    }
    
    // ========================================
    // STATIC UTILITY METHODS
    // ========================================
    
    AntidebugJS.generateFingerprint = () => FingerprintEngine.generate();
    AntidebugJS.detectDevTools = () => DetectionEngine.detectDevToolsAdvanced();
    AntidebugJS.detectInjection = () => DetectionEngine.detectInjectionTools();
    AntidebugJS.detectVM = () => DetectionEngine.detectVirtualEnvironment();
    AntidebugJS.detectAutomation = () => DetectionEngine.detectAutomation();
    
    // Version and build info
    AntidebugJS.version = '4.0.0';
    AntidebugJS.buildDate = new Date().toISOString();
    
    // Quick start method
    AntidebugJS.quickStart = (config = {}) => {
        return new AntidebugJS({
            aggressiveMode: true,
            stealthMode: true,
            enableWasm: true,
            enableFingerprinting: true,
            enableBlockInspect: true,
            blockRightClick: true,
            blockKeyboardShortcuts: true,
            blockTextSelection: true,
            ...config
        });
    };
    
    // Express.js middleware helper
    AntidebugJS.middleware = (options = {}) => {
        return (req, res, next) => {
            const script = `
                <script>
                    (function() {
                        if (window.AntidebugJS) {
                            window.__antidebug = new AntidebugJS(${JSON.stringify(options)});
                        }
                    })();
                </script>
            `;
            
            const originalSend = res.send;
            res.send = function(body) {
                if (typeof body === 'string' && body.includes('</head>')) {
                    body = body.replace('</head>', script + '</head>');
                }
                return originalSend.call(this, body);
            };
            
            next();
        };
    };
    
    return AntidebugJS;
});

// ========================================
// AUTO-INITIALIZATION
// ========================================

(function() {
    if (typeof window !== 'undefined') {
        // Check for global config
        if (window.ANTIDEBUG_CONFIG) {
            window.__antidebug = new window.AntidebugJS(window.ANTIDEBUG_CONFIG);
        }
        
        // Check for data attributes on script tag
        const currentScript = document.currentScript;
        if (currentScript && currentScript.dataset.config) {
            try {
                const config = JSON.parse(currentScript.dataset.config);
                window.__antidebug = new window.AntidebugJS(config);
            } catch (e) {
                console.warn('Invalid AntidebugJS config in data-config attribute');
            }
        }
        
        // Quick start via data attribute
        if (currentScript && currentScript.dataset.quickstart === 'true') {
            window.__antidebug = window.AntidebugJS.quickStart();
        }
    }
})();