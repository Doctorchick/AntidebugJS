class AntidebugDetectors {
  constructor() {
    this.detectionCount = 0;
    this.lastCheckTime = Date.now();
    this.baselinePerformance = this.measureBaseline();
    this.windowDimensions = { width: window.innerWidth, height: window.innerHeight };
    this.setupTraps();
  }

  measureBaseline() {
    const start = performance.now();
    for(let i = 0; i < 1000; i++) Math.random();
    return performance.now() - start;
  }

  setupTraps() {
    const self = this;
    
    Object.defineProperty(window, '__sourceMap', {
      get: function() {
        self.detectionCount++;
        return undefined;
      }
    });

    const originalToString = Function.prototype.toString;
    Function.prototype.toString = function() {
      if (this.name === 'get' || this.name === 'set') {
        self.detectionCount++;
      }
      return originalToString.call(this);
    };
  }

  detectDevTools() {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      this.detectionCount++;
      return true;
    }
    return false;
  }

  detectDebugger() {
    const start = Date.now();
    debugger;
    const timeTaken = Date.now() - start;
    
    if (timeTaken > 100) {
      this.detectionCount++;
      return true;
    }
    return false;
  }

  detectConsoleOpen() {
    const img = new Image();
    let consoleOpen = false;
    
    Object.defineProperty(img, 'id', {
      get: function() {
        consoleOpen = true;
        return 'console-detection';
      }
    });
    
    console.log(img);
    
    if (consoleOpen) {
      this.detectionCount++;
      return true;
    }
    return false;
  }

  detectPerformanceAnomaly() {
    const currentPerformance = this.measureBaseline();
    const deviation = Math.abs(currentPerformance - this.baselinePerformance);
    
    if (deviation > this.baselinePerformance * 2) {
      this.detectionCount++;
      return true;
    }
    return false;
  }

  detectWindowSizeChange() {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    
    const widthChange = Math.abs(currentWidth - this.windowDimensions.width);
    const heightChange = Math.abs(currentHeight - this.windowDimensions.height);
    
    if (widthChange > 200 || heightChange > 200) {
      this.windowDimensions = { width: currentWidth, height: currentHeight };
      this.detectionCount++;
      return true;
    }
    return false;
  }

  detectSuspiciousUserAgent() {
    const ua = navigator.userAgent;
    const suspicious = [
      'HeadlessChrome',
      'PhantomJS',
      'SlimerJS',
      'Nightmare',
      'puppeteer',
      'selenium',
      'webdriver'
    ];
    
    for (const pattern of suspicious) {
      if (ua.includes(pattern)) {
        this.detectionCount++;
        return true;
      }
    }
    return false;
  }

  detectExtensions() {
    const extensionElements = [
      '__REACT_DEVTOOLS_GLOBAL_HOOK__',
      '__REDUX_DEVTOOLS_EXTENSION__',
      '__VUE_DEVTOOLS_GLOBAL_HOOK__',
      'tampermonkey'
    ];
    
    for (const element of extensionElements) {
      if (window[element]) {
        this.detectionCount++;
        return true;
      }
    }
    return false;
  }

  detectVirtualMachine() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
      const renderer = gl.getParameter(gl.RENDERER);
      const vmPatterns = ['VirtualBox', 'VMware', 'QEMU', 'Virtual'];
      
      for (const pattern of vmPatterns) {
        if (renderer.includes(pattern)) {
          this.detectionCount++;
          return true;
        }
      }
    }
    return false;
  }

  detectSourceMapAccess() {
    let accessDetected = false;
    
    Object.defineProperty(Error.prototype, 'stack', {
      get: function() {
        if (new Error().stack && new Error().stack.includes('chrome-extension://')) {
          accessDetected = true;
        }
        return this._stack;
      },
      set: function(value) {
        this._stack = value;
      }
    });
    
    try {
      throw new Error('test');
    } catch (e) {
      // Silent catch
    }
    
    if (accessDetected) {
      this.detectionCount++;
      return true;
    }
    return false;
  }

  detectScopePaneAccess() {
    const self = this;
    
    Object.defineProperty(window, 'scopeAccess', {
      get: function() {
        self.detectionCount++;
        return 'detected';
      }
    });
    
    try {
      if (window.scopeAccess === 'detected') {
        return true;
      }
    } catch (e) {
      // Silent catch
    }
    
    return false;
  }

  runAllDetections() {
    const detections = {
      devtools: this.detectDevTools(),
      debugger: this.detectDebugger(),
      console: this.detectConsoleOpen(),
      performance: this.detectPerformanceAnomaly(),
      windowSize: this.detectWindowSizeChange(),
      userAgent: this.detectSuspiciousUserAgent(),
      extensions: this.detectExtensions(),
      vm: this.detectVirtualMachine(),
      sourcemap: this.detectSourceMapAccess(),
      scope: this.detectScopePaneAccess()
    };
    
    const activeDetections = Object.entries(detections)
      .filter(([, detected]) => detected)
      .map(([method]) => method);
    
    return {
      detected: activeDetections.length > 0,
      methods: activeDetections,
      count: this.detectionCount,
      severity: this.calculateSeverity()
    };
  }

  calculateSeverity() {
    if (this.detectionCount >= 5) return 'critical';
    if (this.detectionCount >= 3) return 'high';
    if (this.detectionCount >= 1) return 'medium';
    return 'low';
  }
}