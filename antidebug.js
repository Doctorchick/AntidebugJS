/** Public API for manual configuration
        configure: function(newConfig) {
            Object.assign(AntidebugConfig, newConfig);
            console.log('🔧 Configuration updated');
        },

        getStatus: function() {
            return {
                initialized: this.initialized,
                securityLevel: AntidebugConfig.securityLevel,
                detectionCount: this.detectionCount,
                activeModules: Object.keys(AntidebugConfig.modules).filter(m => AntidebugConfig.modules[m])
            };
        }
 * AntidebugJS - Advanced Anti-Debug Protection System
 * Version: 2.0.0
 * Author: Security Expert
 * 
 * A comprehensive client-side protection system against debugging,
 * inspection, and reverse engineering attempts.
 */

(function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION MODULE
    // ============================================================================
    const AntidebugConfig = {
        // Security levels: 'Ultra', 'Balanced', 'Stealth'
        securityLevel: 'Balanced', // Modify this to change protection level
        
        // Module toggles - Set to false to disable specific modules
        modules: {
            devtoolsDetection: true,
            extensionDetection: true,
            vmDetection: true,
            integrityCheck: true,
            obfuscation: true,
            antiTampering: true
        },
        
        // Reaction settings
        reactions: {
            redirect: true,
            redirectUrl: 'https://google.com', // Where to redirect when detected
            corruption: true,
            consoleLure: true,
            performanceDegradation: false // Set to true for performance attacks
        },
        
        // Detection sensitivity (1-10, 10 = most sensitive)
        sensitivity: {
            devtools: 7,
            timing: 8,
            window: 6
        },
        
        // Preset configurations
        presets: {
            Ultra: {
                sensitivity: { devtools: 10, timing: 10, window: 9 },
                reactions: { redirect: true, corruption: true, consoleLure: true, performanceDegradation: true }
            },
            Balanced: {
                sensitivity: { devtools: 7, timing: 8, window: 6 },
                reactions: { redirect: true, corruption: true, consoleLure: true, performanceDegradation: false }
            },
            Stealth: {
                sensitivity: { devtools: 5, timing: 6, window: 4 },
                reactions: { redirect: false, corruption: true, consoleLure: false, performanceDegradation: false }
            }
        }
    };

    // ============================================================================
    // OBFUSCATION MODULE
    // ============================================================================
    const ObfuscationModule = {
        // Generate random variable names
        generateRandomName: function() {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let result = '';
            for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },

        // Encrypt strings with simple XOR
        encryptString: function(str, key = 42) {
            return str.split('').map(char => 
                String.fromCharCode(char.charCodeAt(0) ^ key)
            ).join('');
        },

        decryptString: function(str, key = 42) {
            return this.encryptString(str, key); // XOR is symmetric
        },

        // Obfuscate function names dynamically
        obfuscatedNames: {},
        
        getObfuscatedName: function(originalName) {
            if (!this.obfuscatedNames[originalName]) {
                this.obfuscatedNames[originalName] = this.generateRandomName();
            }
            return this.obfuscatedNames[originalName];
        }
    };

    // ============================================================================
    // DETECTION MODULE - DevTools Detection
    // ============================================================================
    const DevToolsDetector = {
        detectionMethods: [],
        isDetected: false,

        // Method 1: SourceMappingURL abuse
        sourceMapDetection: function() {
            const script = document.createElement('script');
            script.innerHTML = `//# sourceMappingURL=data:application/json;base64,${btoa(JSON.stringify({
                version: 3,
                sources: [''],
                names: [],
                mappings: ''
            }))}`;
            document.head.appendChild(script);
            document.head.removeChild(script);
            
            // Check if DevTools processed the source map
            return window.performance.getEntriesByType('navigation').length > 1;
        },

        // Method 2: Scope Pane getter trap (Chromium)
        scopePaneDetection: function() {
            let detected = false;
            const obj = {};
            
            Object.defineProperty(obj, 'id', {
                get: function() {
                    detected = true;
                    return 'trapped';
                },
                configurable: false
            });

            // Trigger scope inspection
            console.dir(obj);
            setTimeout(() => console.clear(), 10);
            
            return detected;
        },

        // Method 3: Performance timing detection
        timingDetection: function() {
            const start = performance.now();
            
            // Create a debug-sensitive operation
            debugger;
            
            const end = performance.now();
            const threshold = AntidebugConfig.sensitivity.timing;
            
            return (end - start) > threshold;
        },

        // Method 4: Window size detection
        windowSizeDetection: function() {
            const threshold = window.outerHeight - window.innerHeight > 160;
            const ratio = (window.outerWidth / window.outerHeight);
            
            return threshold || ratio < 0.5 || ratio > 3;
        },

        // Method 5: Console detection
        consoleDetection: function() {
            let detected = false;
            const originalLog = console.log;
            
            console.log = function() {
                detected = true;
                originalLog.apply(console, arguments);
            };
            
            console.log('%c', '');
            console.log = originalLog;
            
            return detected;
        },

        // Method 6: Function toString detection
        functionToStringDetection: function() {
            const nativeToString = Function.prototype.toString;
            let detected = false;
            
            Function.prototype.toString = function() {
                detected = true;
                return nativeToString.apply(this, arguments);
            };
            
            // Trigger toString call
            setTimeout(function test() {}, 0).toString();
            
            Function.prototype.toString = nativeToString;
            return detected;
        },

        runDetection: function() {
            if (!AntidebugConfig.modules.devtoolsDetection) return false;
            
            const methods = [
                this.sourceMapDetection,
                this.scopePaneDetection,
                this.timingDetection,
                this.windowSizeDetection,
                this.consoleDetection,
                this.functionToStringDetection
            ];

            let detectionCount = 0;
            methods.forEach(method => {
                try {
                    if (method.call(this)) {
                        detectionCount++;
                    }
                } catch(e) {
                    // Silently handle detection errors
                }
            });

            // Require multiple positive detections for accuracy
            this.isDetected = detectionCount >= 2;
            return this.isDetected;
        }
    };

    // ============================================================================
    // EXTENSION DETECTION MODULE
    // ============================================================================
    const ExtensionDetector = {
        knownExtensions: [
            'react-devtools',
            'redux-devtools',
            'tampermonkey',
            'greasemonkey',
            'violentmonkey'
        ],

        detectReactDevTools: function() {
            return !!(window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || 
                     document.querySelector('[data-reactroot]'));
        },

        detectReduxDevTools: function() {
            return !!(window.__REDUX_DEVTOOLS_EXTENSION__ || 
                     window.devToolsExtension);
        },

        detectTamperMonkey: function() {
            return !!(window.GM_info || window.GM_setValue || 
                     document.querySelector('script[src*="tampermonkey"]'));
        },

        detectUserScriptManagers: function() {
            const managers = ['GM_info', 'GM_setValue', 'GM_getValue', 'unsafeWindow'];
            return managers.some(manager => window[manager]);
        },

        runDetection: function() {
            if (!AntidebugConfig.modules.extensionDetection) return false;

            return this.detectReactDevTools() || 
                   this.detectReduxDevTools() || 
                   this.detectTamperMonkey() || 
                   this.detectUserScriptManagers();
        }
    };

    // ============================================================================
    // VM DETECTION MODULE
    // ============================================================================
    const VMDetector = {
        detectVM: function() {
            if (!AntidebugConfig.modules.vmDetection) return false;

            // Check for common VM indicators
            const vmIndicators = [
                navigator.userAgent.includes('HeadlessChrome'),
                navigator.userAgent.includes('PhantomJS'),
                navigator.userAgent.includes('SlimerJS'),
                window.phantom !== undefined,
                window._phantom !== undefined,
                window.callPhantom !== undefined,
                navigator.webdriver === true,
                window.chrome && !window.chrome.runtime
            ];

            return vmIndicators.some(indicator => indicator);
        },

        detectAutomation: function() {
            // Check for automation frameworks
            return !!(window.webdriver || 
                     navigator.webdriver || 
                     window.chrome?.runtime?.onConnect ||
                     document.querySelector('[webdriver]'));
        },

        runDetection: function() {
            return this.detectVM() || this.detectAutomation();
        }
    };

    // ============================================================================
    // INTEGRITY CHECK MODULE
    // ============================================================================
    const IntegrityChecker = {
        originalCode: null,
        checksum: null,

        calculateChecksum: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return hash;
        },

        initializeChecksum: function() {
            if (!AntidebugConfig.modules.integrityCheck) return;
            
            // Get current script content
            const scripts = document.getElementsByTagName('script');
            let scriptContent = '';
            
            for (let script of scripts) {
                if (script.innerHTML.includes('AntidebugJS')) {
                    scriptContent = script.innerHTML;
                    break;
                }
            }
            
            this.originalCode = scriptContent;
            this.checksum = this.calculateChecksum(scriptContent);
        },

        verifyIntegrity: function() {
            if (!AntidebugConfig.modules.integrityCheck || !this.originalCode) return true;
            
            const scripts = document.getElementsByTagName('script');
            let currentContent = '';
            
            for (let script of scripts) {
                if (script.innerHTML.includes('AntidebugJS')) {
                    currentContent = script.innerHTML;
                    break;
                }
            }
            
            const currentChecksum = this.calculateChecksum(currentContent);
            return currentChecksum === this.checksum;
        }
    };

    // ============================================================================
    // REACTION MODULE
    // ============================================================================
    const ReactionModule = {
        // Redirect to specified URL
        redirect: function() {
            if (AntidebugConfig.reactions.redirect) {
                setTimeout(() => {
                    window.location.href = AntidebugConfig.reactions.redirectUrl;
                }, Math.random() * 1000 + 500);
            }
        },

        // Progressively corrupt the page
        corruption: function() {
            if (!AntidebugConfig.reactions.corruption) return;

            let corruptionLevel = 0;
            const corruptionInterval = setInterval(() => {
                corruptionLevel++;
                
                // Progressive corruption techniques
                if (corruptionLevel === 1) {
                    // Hide random elements
                    const elements = document.querySelectorAll('*');
                    const randomElements = Array.from(elements)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, Math.floor(elements.length * 0.1));
                    
                    randomElements.forEach(el => {
                        if (Math.random() > 0.7) {
                            el.style.visibility = 'hidden';
                        }
                    });
                }
                
                if (corruptionLevel === 2) {
                    // Slow down animations
                    document.documentElement.style.cssText += `
                        *, *::before, *::after {
                            animation-duration: 10s !important;
                            transition-duration: 5s !important;
                        }
                    `;
                }
                
                if (corruptionLevel === 3) {
                    // Add fake errors to console
                    console.error('Uncaught ReferenceError: $ is not defined');
                    console.error('Failed to load resource: net::ERR_CONNECTION_REFUSED');
                }
                
                if (corruptionLevel >= 5) {
                    clearInterval(corruptionInterval);
                    this.redirect();
                }
                
            }, 2000);
        },

        // Console lure with fake obfuscated code
        consoleLure: function() {
            if (!AntidebugConfig.reactions.consoleLure) return;

            const fakeCode = [
                ObfuscationModule.encryptString('var a=function(){return false;}'),
                ObfuscationModule.encryptString('window.debug=null;'),
                ObfuscationModule.encryptString('console.log=function(){}'),
                '(function(){var _0x1234=[\'log\',\'warn\',\'error\'];})();',
                'eval(atob(\'Y29uc29sZS5sb2cgPSBmdW5jdGlvbigpe307\'));'
            ];

            let lureInterval = setInterval(() => {
                const randomCode = fakeCode[Math.floor(Math.random() * fakeCode.length)];
                console.log(`%c${randomCode}`, 'color: #00ff00; font-family: monospace;');
            }, 3000 + Math.random() * 2000);

            // Stop after 30 seconds
            setTimeout(() => clearInterval(lureInterval), 30000);
        },

        // Performance degradation attack
        performanceDegradation: function() {
            if (!AntidebugConfig.reactions.performanceDegradation) return;

            // Create memory leaks
            let memoryLeak = [];
            setInterval(() => {
                for (let i = 0; i < 1000; i++) {
                    memoryLeak.push(new Array(1000).fill(Math.random()));
                }
                if (memoryLeak.length > 10000) {
                    memoryLeak = memoryLeak.slice(5000); // Keep some references
                }
            }, 100);

            // CPU intensive operations
            setInterval(() => {
                const start = Date.now();
                while (Date.now() - start < 10) {
                    Math.random() * Math.random();
                }
            }, 50);
        },

        executeReaction: function() {
            console.warn('🔒 Antidebug Protection Activated');
            
            // Execute reactions based on configuration
            this.consoleLure();
            
            setTimeout(() => {
                this.corruption();
            }, 1000);
            
            setTimeout(() => {
                this.performanceDegradation();
            }, 2000);
            
            setTimeout(() => {
                this.redirect();
            }, 5000);
        }
    };

    // ============================================================================
    // ANTI-TAMPERING MODULE
    // ============================================================================
    const AntiTamperingModule = {
        protectedFunctions: new Map(),

        protectFunction: function(obj, funcName) {
            if (!AntidebugConfig.modules.antiTampering) return;

            const originalFunc = obj[funcName];
            if (!originalFunc) return;

            this.protectedFunctions.set(funcName, originalFunc);

            Object.defineProperty(obj, funcName, {
                get: function() {
                    return originalFunc;
                },
                set: function(newValue) {
                    console.warn(`🚫 Tampering detected on ${funcName}`);
                    ReactionModule.executeReaction();
                    return originalFunc;
                },
                configurable: false,
                enumerable: true
            });
        },

        protectConsole: function() {
            const consoleMethods = ['log', 'warn', 'error', 'debug', 'info', 'clear'];
            consoleMethods.forEach(method => {
                this.protectFunction(console, method);
            });
        },

        protectGlobalFunctions: function() {
            const globalFunctions = ['eval', 'setTimeout', 'setInterval'];
            globalFunctions.forEach(func => {
                this.protectFunction(window, func);
            });
        },

        initialize: function() {
            this.protectConsole();
            this.protectGlobalFunctions();
        }
    };

    // ============================================================================
    // MAIN ANTIDEBUG CONTROLLER
    // ============================================================================
    const AntidebugJS = {
        initialized: false,
        detectionCount: 0,
        maxDetections: 3,

        applyPreset: function(presetName) {
            if (AntidebugConfig.presets[presetName]) {
                const preset = AntidebugConfig.presets[presetName];
                AntidebugConfig.sensitivity = { ...AntidebugConfig.sensitivity, ...preset.sensitivity };
                AntidebugConfig.reactions = { ...AntidebugConfig.reactions, ...preset.reactions };
                console.log(`🔧 Applied ${presetName} security preset`);
            }
        },

        runDetection: function() {
            const detectionResults = {
                devtools: DevToolsDetector.runDetection(),
                extensions: ExtensionDetector.runDetection(),
                vm: VMDetector.runDetection(),
                integrity: !IntegrityChecker.verifyIntegrity()
            };

            const detectedThreats = Object.keys(detectionResults).filter(key => detectionResults[key]);
            
            if (detectedThreats.length > 0) {
                this.detectionCount++;
                console.warn(`⚠️ Threats detected: ${detectedThreats.join(', ')}`);
                
                if (this.detectionCount >= this.maxDetections) {
                    ReactionModule.executeReaction();
                    return true;
                }
            }

            return false;
        },

        continuousMonitoring: function() {
            // Run detection every few seconds with random intervals
            const baseInterval = 3000;
            const randomOffset = Math.random() * 2000;
            
            setTimeout(() => {
                if (!this.runDetection()) {
                    this.continuousMonitoring();
                }
            }, baseInterval + randomOffset);
        },

        initialize: function(config = {}) {
            if (this.initialized) return;
            
            console.log('🛡️ AntidebugJS Initializing...');
            
            // Apply custom configuration
            Object.assign(AntidebugConfig, config);
            
            // Apply preset if specified
            if (AntidebugConfig.securityLevel && AntidebugConfig.presets[AntidebugConfig.securityLevel]) {
                this.applyPreset(AntidebugConfig.securityLevel);
            }
            
            // Initialize modules
            if (AntidebugConfig.modules.obfuscation) {
                // Generate obfuscated names for critical functions
                ObfuscationModule.getObfuscatedName('detectDevTools');
                ObfuscationModule.getObfuscatedName('executeReaction');
            }
            
            if (AntidebugConfig.modules.integrityCheck) {
                IntegrityChecker.initializeChecksum();
            }
            
            if (AntidebugConfig.modules.antiTampering) {
                AntiTamperingModule.initialize();
            }
            
            // Start continuous monitoring
            this.continuousMonitoring();
            
            // Initial detection run
            setTimeout(() => this.runDetection(), 1000);
            
            this.initialized = true;
            console.log('✅ AntidebugJS Active - Protection Level:', AntidebugConfig.securityLevel);
        },

        // Public API for manual configuration
        configure: function(newConfig) {
            Object.assign(FortressConfig, newConfig);
            console.log('🔧 Configuration updated');
        },

        getStatus: function() {
            return {
                initialized: this.initialized,
                securityLevel: FortressConfig.securityLevel,
                detectionCount: this.detectionCount,
                activeModules: Object.keys(FortressConfig.modules).filter(m => FortressConfig.modules[m])
            };
        }
    };

    // ============================================================================
    // AUTO-INITIALIZATION
    // ============================================================================
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AntidebugJS.initialize());
    } else {
        AntidebugJS.initialize();
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            AntidebugJS.runDetection();
        }
    });

    // Expose limited API to window (can be disabled for stealth mode)
    if (AntidebugConfig.securityLevel !== 'Stealth') {
        window.AntidebugJS = {
            configure: AntidebugJS.configure.bind(AntidebugJS),
            getStatus: AntidebugJS.getStatus.bind(AntidebugJS),
            version: '2.0.0'
        };
    }

    console.log('%c🔒 AntidebugJS 2.0.0 Loaded', 'color: #ff6b35; font-weight: bold; font-size: 14px;');

})();