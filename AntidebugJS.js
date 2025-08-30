/**
 * AntidebugJS - Industrial Anti-Debugging Solution
 * Version: 3.0.0
 * Single-file implementation with JSON configuration
 */

class AntidebugJS {
  constructor(config = {}) {
    this.defaultConfig = {
      "level": "balanced",
      "detectionMethods": {
        "devtools": { "enabled": true, "sensitivity": 0.8, "interval": 1000 },
        "console": { "enabled": true, "sensitivity": 0.9, "interval": 500 },
        "timing": { "enabled": true, "sensitivity": 0.7, "interval": 2000 },
        "extensions": { "enabled": true, "sensitivity": 0.6, "interval": 3000 },
        "headless": { "enabled": true, "sensitivity": 0.8, "interval": 5000 },
        "behavior": { "enabled": false, "sensitivity": 0.5, "interval": 10000 }
      },
      "reactions": {
        "onDetection": [
          { "type": "log", "severity": "warn" },
          { "type": "callback", "function": null }
        ],
        "escalation": {
          "enabled": true,
          "steps": [
            { "threshold": 3, "actions": ["obfuscate", "slowdown"] },
            { "threshold": 5, "actions": ["corrupt", "redirect"] }
          ]
        }
      },
      "obfuscation": {
        "enabled": true,
        "stringEncryption": true,
        "controlFlowFlattening": false,
        "deadCodeInjection": true
      },
      "stealth": {
        "hideFromDevtools": true,
        "antiHooking": true,
        "polymorphic": false
      },
      "telemetry": {
        "enabled": false,
        "endpoint": null,
        "apiKey": null
      }
    };

    this.config = this.mergeConfig(this.defaultConfig, config);
    this.detectionCount = new Map();
    this.active = false;
    this.intervals = [];
    this.eventListeners = new Map();
    this.originalFunctions = new Map();
    this.behaviorProfile = new Map();

    this.init();
  }

  // Configuration Management
  mergeConfig(defaults, custom) {
    const merged = JSON.parse(JSON.stringify(defaults));
    
    function deepMerge(target, source) {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    
    deepMerge(merged, custom);
    return merged;
  }

  updateConfig(newConfig) {
    this.config = this.mergeConfig(this.config, newConfig);
    if (this.active) {
      this.stop();
      this.start();
    }
    return this;
  }

  // Initialization
  init() {
    this.setupStealth();
    this.bindDetectionMethods();
  }

  setupStealth() {
    if (!this.config.stealth.hideFromDevtools) return;

    // Hide constructor and methods from inspection
    try {
      Object.defineProperty(this.constructor, 'name', {
        value: 'Object',
        configurable: false
      });

      // Anti-hooking protection
      if (this.config.stealth.antiHooking) {
        this.protectCriticalFunctions();
      }
    } catch (e) {
      // Silently fail in restricted environments
    }
  }

  protectCriticalFunctions() {
    const criticalFunctions = [
      'console.log', 'console.warn', 'console.error',
      'setTimeout', 'setInterval', 'eval'
    ];

    criticalFunctions.forEach(path => {
      try {
        const func = this.getNestedProperty(window, path);
        if (func && typeof func === 'function') {
          const original = func.toString();
          this.originalFunctions.set(path, original);
        }
      } catch (e) {
        // Function access restricted
      }
    });
  }

  // Core Detection Engine
  start() {
    if (this.active) return this;

    this.active = true;
    this.setupDetectionLoop();
    this.setupBehaviorProfiling();
    
    this.emit('started');
    return this;
  }

  stop() {
    this.active = false;
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    this.cleanupEventListeners();
    
    this.emit('stopped');
    return this;
  }

  setupDetectionLoop() {
    const methods = this.config.detectionMethods;
    
    Object.keys(methods).forEach(method => {
      if (!methods[method].enabled) return;
      
      const interval = setInterval(() => {
        if (!this.active) return;
        this.runDetection(method);
      }, methods[method].interval);
      
      this.intervals.push(interval);
    });
  }

  async runDetection(method) {
    try {
      const detector = this.detectors[method];
      if (!detector) return;

      const result = await detector.call(this);
      
      if (result.detected) {
        this.handleDetection(method, result);
      }
    } catch (error) {
      // Detection failed, might indicate tampering
      this.handleDetection(method, {
        detected: true,
        confidence: 0.5,
        metadata: { error: error.message }
      });
    }
  }

  handleDetection(method, result) {
    const count = this.detectionCount.get(method) || 0;
    this.detectionCount.set(method, count + 1);

    const event = {
      method,
      timestamp: Date.now(),
      confidence: result.confidence,
      metadata: result.metadata,
      count: count + 1
    };

    this.emit('detection', event);
    this.executeReactions(event);
    this.sendTelemetry(event);
  }

  // Detection Methods
  detectors = {
    // DevTools Detection via timing analysis
    devtools: async function() {
      const measurements = [];
      
      for (let i = 0; i < 5; i++) {
        const start = performance.now();
        debugger;
        console.log('');
        measurements.push(performance.now() - start);
        await this.sleep(10);
      }
      
      const avgTime = measurements.reduce((a, b) => a + b) / measurements.length;
      const variance = this.calculateVariance(measurements);
      
      const threshold = 5 * this.config.detectionMethods.devtools.sensitivity;
      const detected = avgTime > threshold || variance > 2;
      
      return {
        detected,
        confidence: detected ? Math.min(avgTime / threshold * 0.8, 1.0) : 0,
        metadata: { avgTime, variance, measurements }
      };
    },

    // Console Access Detection
    console: function() {
      const originalLog = console.log;
      let accessCount = 0;
      let hookDetected = false;
      
      // Check if console functions have been hooked
      const consoleMethods = ['log', 'warn', 'error', 'info', 'debug'];
      consoleMethods.forEach(method => {
        const func = console[method];
        if (func && typeof func === 'function') {
          const funcString = func.toString();
          if (!funcString.includes('[native code]') && 
              !funcString.includes('function log() { [native code] }')) {
            hookDetected = true;
          }
        }
      });

      // Test console responsiveness
      const start = performance.now();
      try {
        console.clear();
        console.count('test');
      } catch (e) {
        hookDetected = true;
      }
      const consoleTime = performance.now() - start;

      return {
        detected: hookDetected || consoleTime > 10,
        confidence: hookDetected ? 0.9 : Math.min(consoleTime / 10, 1.0),
        metadata: { hookDetected, consoleTime }
      };
    },

    // Advanced Timing Analysis
    timing: async function() {
      const tests = [
        this.timingTest.bind(this),
        this.renderingTest.bind(this),
        this.memoryTest.bind(this)
      ];
      
      const results = await Promise.all(tests.map(test => test()));
      const detected = results.some(r => r.anomaly);
      const avgConfidence = results.reduce((acc, r) => acc + r.confidence, 0) / results.length;
      
      return {
        detected,
        confidence: avgConfidence,
        metadata: { tests: results }
      };
    },

    // Browser Extensions Detection
    extensions: function() {
      const extensions = [
        { name: 'React DevTools', check: () => window.__REACT_DEVTOOLS_GLOBAL_HOOK__ },
        { name: 'Vue DevTools', check: () => window.__VUE_DEVTOOLS_GLOBAL_HOOK__ },
        { name: 'Redux DevTools', check: () => window.__REDUX_DEVTOOLS_EXTENSION__ },
        { name: 'Angular DevTools', check: () => window.ng },
        { name: 'Tampermonkey', check: () => window.tampermonkey },
        { name: 'Greasemonkey', check: () => window.greasemonkey }
      ];
      
      const detected = extensions.filter(ext => {
        try {
          return ext.check();
        } catch (e) {
          return false;
        }
      });
      
      return {
        detected: detected.length > 0,
        confidence: detected.length / extensions.length,
        metadata: { extensions: detected.map(e => e.name) }
      };
    },

    // Headless Browser Detection
    headless: function() {
      const tests = [
        () => window.navigator.webdriver,
        () => window.outerHeight === 0,
        () => window.outerWidth === 0,
        () => navigator.plugins.length === 0,
        () => window.chrome && window.chrome.runtime,
        () => window.callPhantom || window._phantom,
        () => window.Buffer,
        () => window.selenium || window.__selenium_unwrapped,
        () => document.$cdc_asdjflasutopfhvcZLmcfl_
      ];
      
      const positives = tests.filter(test => {
        try {
          return test();
        } catch (e) {
          return false;
        }
      });
      
      return {
        detected: positives.length >= 2,
        confidence: positives.length / tests.length,
        metadata: { indicators: positives.length }
      };
    },

    // Behavioral Analysis (Machine Learning inspired)
    behavior: function() {
      const metrics = this.collectBehaviorMetrics();
      const anomalyScore = this.calculateBehaviorAnomaly(metrics);
      
      return {
        detected: anomalyScore > 0.7,
        confidence: anomalyScore,
        metadata: { metrics, anomalyScore }
      };
    }
  };

  // Helper Detection Methods
  async timingTest() {
    const iterations = 1000;
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      Math.random();
    }
    
    const executionTime = performance.now() - start;
    const expectedTime = iterations * 0.001; // Rough estimate
    const anomaly = executionTime > expectedTime * 2;
    
    return {
      anomaly,
      confidence: anomaly ? Math.min(executionTime / (expectedTime * 2), 1.0) : 0,
      executionTime
    };
  }

  async renderingTest() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `hsl(${i * 3.6}, 50%, 50%)`;
      ctx.fillRect(i * 2, i, 1, 1);
    }
    const renderTime = performance.now() - start;
    
    return {
      anomaly: renderTime > 50,
      confidence: renderTime > 50 ? Math.min(renderTime / 50, 1.0) : 0,
      renderTime
    };
  }

  async memoryTest() {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Create memory pressure
    const arrays = [];
    for (let i = 0; i < 100; i++) {
      arrays.push(new Array(1000).fill(Math.random()));
    }
    
    await this.sleep(100);
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryDelta = finalMemory - initialMemory;
    
    // Cleanup
    arrays.length = 0;
    
    return {
      anomaly: memoryDelta < 10000 || memoryDelta > 1000000,
      confidence: memoryDelta === 0 ? 0.8 : 0.2,
      memoryDelta
    };
  }

  // Behavior Analysis
  setupBehaviorProfiling() {
    if (!this.config.detectionMethods.behavior.enabled) return;

    const events = ['mousemove', 'click', 'keydown', 'scroll'];
    
    events.forEach(eventType => {
      const handler = (e) => this.recordBehaviorEvent(eventType, e);
      document.addEventListener(eventType, handler, { passive: true });
      this.eventListeners.set(eventType, handler);
    });
  }

  recordBehaviorEvent(type, event) {
    const profile = this.behaviorProfile.get(type) || [];
    profile.push({
      timestamp: Date.now(),
      x: event.clientX || 0,
      y: event.clientY || 0,
      key: event.key || null
    });
    
    // Keep only last 100 events per type
    this.behaviorProfile.set(type, profile.slice(-100));
  }

  collectBehaviorMetrics() {
    const metrics = {};
    
    this.behaviorProfile.forEach((events, type) => {
      if (events.length < 2) return;
      
      const timings = [];
      const distances = [];
      
      for (let i = 1; i < events.length; i++) {
        const prev = events[i - 1];
        const curr = events[i];
        
        timings.push(curr.timestamp - prev.timestamp);
        
        if (type === 'mousemove') {
          const dx = curr.x - prev.x;
          const dy = curr.y - prev.y;
          distances.push(Math.sqrt(dx * dx + dy * dy));
        }
      }
      
      metrics[type] = {
        frequency: events.length / 60, // events per minute
        avgTiming: timings.reduce((a, b) => a + b, 0) / timings.length,
        timingVariance: this.calculateVariance(timings),
        avgDistance: distances.length ? distances.reduce((a, b) => a + b, 0) / distances.length : 0
      };
    });
    
    return metrics;
  }

  calculateBehaviorAnomaly(metrics) {
    // Simplified anomaly detection
    let anomalyScore = 0;
    let tests = 0;
    
    Object.values(metrics).forEach(metric => {
      tests++;
      
      // Too regular timing (bot-like)
      if (metric.timingVariance < 10) anomalyScore += 0.3;
      
      // Unusual frequency
      if (metric.frequency > 1000 || metric.frequency < 0.1) anomalyScore += 0.2;
      
      // Too regular movement patterns
      if (metric.avgDistance && metric.avgDistance < 1) anomalyScore += 0.2;
    });
    
    return tests > 0 ? anomalyScore / tests : 0;
  }

  // Reaction System
  executeReactions(event) {
    const reactions = this.config.reactions.onDetection;
    
    reactions.forEach(reaction => {
      try {
        switch (reaction.type) {
          case 'log':
            console[reaction.severity || 'warn'](`AntidebugJS: ${event.method} detected`, event);
            break;
          case 'callback':
            if (reaction.function && typeof reaction.function === 'function') {
              reaction.function(event);
            }
            break;
          case 'obfuscate':
            this.obfuscateCode();
            break;
          case 'slowdown':
            this.createPerformanceDegradation();
            break;
          case 'corrupt':
            this.corruptData();
            break;
          case 'redirect':
            if (reaction.url) {
              window.location.href = reaction.url;
            }
            break;
        }
      } catch (error) {
        // Reaction failed
      }
    });

    // Check escalation
    this.checkEscalation(event);
  }

  checkEscalation(event) {
    if (!this.config.reactions.escalation.enabled) return;

    const totalDetections = Array.from(this.detectionCount.values()).reduce((a, b) => a + b, 0);
    const steps = this.config.reactions.escalation.steps;

    steps.forEach(step => {
      if (totalDetections >= step.threshold) {
        step.actions.forEach(action => {
          this.executeReaction({ type: action }, event);
        });
      }
    });
  }

  executeReaction(reaction, event) {
    // Execute single reaction
    this.executeReactions({ ...event, reactions: [reaction] });
  }

  // Obfuscation & Countermeasures
  obfuscateCode() {
    if (!this.config.obfuscation.enabled) return;

    // Simple string obfuscation
    if (this.config.obfuscation.stringEncryption) {
      this.obfuscateStrings();
    }

    // Dead code injection
    if (this.config.obfuscation.deadCodeInjection) {
      this.injectDeadCode();
    }
  }

  obfuscateStrings() {
    // Find and encrypt string literals (simplified)
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src || !script.textContent) return;
      
      try {
        const content = script.textContent;
        const obfuscated = content.replace(
          /"([^"]+)"/g, 
          (match, str) => `atob("${btoa(str)}")`
        );
        
        if (obfuscated !== content) {
          script.textContent = obfuscated;
        }
      } catch (e) {
        // Obfuscation failed
      }
    });
  }

  injectDeadCode() {
    // Inject confusing code
    const deadCode = `
      (function() {
        const _decoy = Math.random() > 0.5 ? function() { return true; } : function() { return false; };
        if (_decoy()) { var _unused = 'decoy'; }
      })();
    `;
    
    const script = document.createElement('script');
    script.textContent = deadCode;
    document.head.appendChild(script);
  }

  createPerformanceDegradation() {
    // Subtle performance impact
    let counter = 0;
    const degradeInterval = setInterval(() => {
      for (let i = 0; i < 1000; i++) {
        Math.random();
      }
      counter++;
      if (counter > 10) clearInterval(degradeInterval);
    }, 100);
  }

  corruptData() {
    // Corrupt specific data structures
    try {
      if (window.localStorage) {
        const keys = Object.keys(window.localStorage);
        keys.forEach(key => {
          if (Math.random() < 0.1) {
            window.localStorage.setItem(key, 'corrupted_by_antidebugjs');
          }
        });
      }
    } catch (e) {
      // Corruption failed
    }
  }

  // Telemetry
  async sendTelemetry(event) {
    if (!this.config.telemetry.enabled || !this.config.telemetry.endpoint) return;

    try {
      await fetch(this.config.telemetry.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.telemetry.apiKey}`
        },
        body: JSON.stringify({
          events: [event],
          fingerprint: this.generateFingerprint(),
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      // Telemetry failed
    }
  }

  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Fingerprint', 2, 2);
    
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ];
    
    return this.simpleHash(components.join('|'));
  }

  // Utility Methods
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  calculateVariance(numbers) {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((a, b) => a + b) / numbers.length;
    return numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
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

  getNestedProperty(obj, path) {
    return path.split('.').reduce((current, prop) => current && current[prop], obj);
  }

  cleanupEventListeners() {
    this.eventListeners.forEach((handler, eventType) => {
      document.removeEventListener(eventType, handler);
    });
    this.eventListeners.clear();
  }

  // Event System
  emit(event, data) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (e) {
        // Listener failed
      }
    });
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
    return this;
  }

  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    }
    return this;
  }

  // Public API
  getStatus() {
    return {
      active: this.active,
      detections: Object.fromEntries(this.detectionCount),
      config: this.config.level,
      methods: Object.keys(this.config.detectionMethods).filter(
        method => this.config.detectionMethods[method].enabled
      )
    };
  }
}

// Factory function for different presets
AntidebugJS.create = function(preset = 'balanced', customConfig = {}) {
  const presets = {
    stealth: {
      level: 'stealth',
      detectionMethods: {
        devtools: { enabled: true, sensitivity: 1.0, interval: 500 },
        console: { enabled: true, sensitivity: 1.0, interval: 250 },
        timing: { enabled: true, sensitivity: 1.0, interval: 1000 },
        extensions: { enabled: true, sensitivity: 1.0, interval: 2000 },
        headless: { enabled: true, sensitivity: 1.0, interval: 3000 },
        behavior: { enabled: true, sensitivity: 0.8, interval: 5000 }
      },
      stealth: {
        hideFromDevtools: true,
        antiHooking: true,
        polymorphic: true
      },
      obfuscation: {
        enabled: true,
        stringEncryption: true,
        controlFlowFlattening: true,
        deadCodeInjection: true
      }
    },
    
    balanced: {
      level: 'balanced'
    },
    
    aggressive: {
      level: 'aggressive',
      detectionMethods: {
        devtools: { enabled: true, sensitivity: 0.9, interval: 800 },
        console: { enabled: true, sensitivity: 0.9, interval: 400 },
        timing: { enabled: true, sensitivity: 0.8, interval: 1500 },
        extensions: { enabled: true, sensitivity: 0.7, interval: 2500 },
        headless: { enabled: true, sensitivity: 0.9, interval: 4000 },
        behavior: { enabled: false, sensitivity: 0.6, interval: 8000 }
      },
      reactions: {
        escalation: {
          enabled: true,
          steps: [
            { threshold: 2, actions: ['obfuscate'] },
            { threshold: 4, actions: ['slowdown', 'corrupt'] },
            { threshold: 6, actions: ['redirect'] }
          ]
        }
      }
    }
  };
  
  const presetConfig = presets[preset] || presets.balanced;
  return new AntidebugJS({ ...presetConfig, ...customConfig });
};

// Auto-initialization if config found in DOM
document.addEventListener('DOMContentLoaded', () => {
  const configScript = document.querySelector('script[data-antidebug-config]');
  if (configScript) {
    try {
      const config = JSON.parse(configScript.textContent || '{}');
      window.antidebugjs = new AntidebugJS(config);
      if (config.autoStart !== false) {
        window.antidebugjs.start();
      }
    } catch (e) {
      console.warn('AntidebugJS: Invalid configuration', e);
    }
  }
});

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AntidebugJS;
} else if (typeof define === 'function' && define.amd) {
  define(() => AntidebugJS);
} else {
  window.AntidebugJS = AntidebugJS;
}