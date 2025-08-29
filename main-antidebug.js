class AntidebugJS {
  constructor(configLevel = 'BALANCED') {
    this.config = AntidebugConfig.LEVELS[configLevel] || AntidebugConfig.LEVELS.BALANCED;
    this.detectors = new AntidebugDetectors();
    this.reactions = new AntidebugReactions(this.config);
    this.obfuscator = new AntidebugObfuscator();
    
    this.isActive = true;
    this.checkCount = 0;
    this.maxChecks = 1000;
    this.adaptiveFactor = 1;
    
    this.initialize();
  }

  initialize() {
    console.warn(AntidebugConfig.MESSAGES.consoleWarning);
    
    this.obfuscator.injectAntiDebugTraps();
    this.reactions.createDecoyElements();
    
    if (this.config.enableWebAssembly) {
      this.wasmModule = this.obfuscator.createWebAssemblyTrap();
    }
    
    this.startMonitoring();
    this.setupEventListeners();
    
    if (this.config.enablePolymorphism) {
      this.enablePolymorphicBehavior();
    }
  }

  startMonitoring() {
    const monitoringLoop = () => {
      if (!this.isActive || this.checkCount >= this.maxChecks) return;
      
      this.checkCount++;
      const detection = this.detectors.runAllDetections();
      
      if (detection.detected) {
        this.handleDetection(detection);
      }
      
      const adaptiveInterval = Math.max(
        this.config.checkInterval / this.adaptiveFactor,
        100
      );
      
      setTimeout(monitoringLoop, adaptiveInterval);
    };
    
    setTimeout(monitoringLoop, this.config.checkInterval);
  }

  handleDetection(detection) {
    console.warn(`Anti-debug detection: ${detection.methods.join(', ')}`);
    
    this.adaptiveFactor = Math.min(this.adaptiveFactor * 1.2, 10);
    
    if (detection.count >= this.config.debuggerTolerance) {
      this.reactions.executeReaction(detection, this.config.obfuscationLevel);
    }
    
    this.logDetection(detection);
  }

  logDetection(detection) {
    const logData = {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      detection: detection,
      adaptiveFactor: this.adaptiveFactor,
      checkCount: this.checkCount
    };
    
    try {
      const existingLogs = JSON.parse(sessionStorage.getItem('antidebug_logs') || '[]');
      existingLogs.push(logData);
      
      if (existingLogs.length > 50) {
        existingLogs.splice(0, 25);
      }
      
      sessionStorage.setItem('antidebug_logs', JSON.stringify(existingLogs));
    } catch (e) {
      // Silent error handling for storage issues
    }
  }

  setupEventListeners() {
    const self = this;
    
    document.addEventListener('keydown', function(e) {
      const suspiciousKeys = [
        { key: 'F12' },
        { key: 'F11' },
        { ctrl: true, shift: true, key: 'I' },
        { ctrl: true, shift: true, key: 'C' },
        { ctrl: true, shift: true, key: 'J' },
        { ctrl: true, key: 'U' }
      ];
      
      for (const combo of suspiciousKeys) {
        let match = true;
        
        if (combo.ctrl && !e.ctrlKey) match = false;
        if (combo.shift && !e.shiftKey) match = false;
        if (combo.key && e.key !== combo.key) match = false;
        
        if (match) {
          e.preventDefault();
          e.stopPropagation();
          self.detectors.detectionCount++;
          self.handleDetection({
            detected: true,
            methods: ['keyboard_shortcut'],
            count: self.detectors.detectionCount,
            severity: 'high'
          });
          return false;
        }
      }
    });
    
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      self.detectors.detectionCount++;
      return false;
    });
    
    window.addEventListener('resize', function() {
      setTimeout(() => {
        if (self.detectors.detectWindowSizeChange()) {
          self.handleDetection({
            detected: true,
            methods: ['window_resize'],
            count: self.detectors.detectionCount,
            severity: 'medium'
          });
        }
      }, 500);
    });
    
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        self.detectors.detectionCount++;
      }
    });
  }

  enablePolymorphicBehavior() {
    const self = this;
    
    setInterval(() => {
      const methods = ['detectDevTools', 'detectDebugger', 'detectConsoleOpen'];
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];
      
      if (self.detectors[randomMethod]) {
        const originalMethod = self.detectors[randomMethod];
        self.detectors[randomMethod] = self.obfuscator.createPolymorphicFunction(
          randomMethod,
          originalMethod.bind(self.detectors)
        );
      }
    }, 30000);
  }

  disable() {
    this.isActive = false;
    console.log('AntidebugJS++ disabled');
  }

  enable() {
    this.isActive = true;
    this.startMonitoring();
    console.log('AntidebugJS++ enabled');
  }

  getStatus() {
    return {
      active: this.isActive,
      config: this.config.name,
      detectionCount: this.detectors.detectionCount,
      checkCount: this.checkCount,
      adaptiveFactor: this.adaptiveFactor,
      reactionHistory: this.reactions.reactionHistory.length
    };
  }

  updateConfig(newConfigLevel) {
    this.config = AntidebugConfig.LEVELS[newConfigLevel] || this.config;
    this.reactions.config = this.config;
    console.log(`Configuration updated to: ${this.config.name}`);
  }

  static createInstance(configLevel = 'BALANCED') {
    if (window.antidebugInstance) {
      console.warn('AntidebugJS++ instance already exists');
      return window.antidebugInstance;
    }
    
    window.antidebugInstance = new AntidebugJS(configLevel);
    return window.antidebugInstance;
  }

  static getInstance() {
    return window.antidebugInstance || null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AntidebugJS,
    AntidebugConfig,
    AntidebugDetectors,
    AntidebugReactions,
    AntidebugObfuscator
  };
}

window.AntidebugJS = AntidebugJS;