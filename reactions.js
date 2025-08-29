class AntidebugReactions {
  constructor(config) {
    this.config = config;
    this.reactionHistory = [];
    this.corruptionLevel = 0;
    this.fakeDataActive = false;
    this.performanceDegradationActive = false;
  }

  executeReaction(detection, level = 'medium') {
    this.reactionHistory.push({
      timestamp: Date.now(),
      detection: detection.methods,
      severity: detection.severity
    });

    const reactionDelay = this.calculateAdaptiveDelay();
    
    setTimeout(() => {
      switch (detection.severity) {
        case 'critical':
          this.executeCriticalReaction();
          break;
        case 'high':
          this.executeHighReaction();
          break;
        case 'medium':
          this.executeMediumReaction();
          break;
        default:
          this.executeLowReaction();
      }
    }, reactionDelay);
  }

  calculateAdaptiveDelay() {
    const baseDelay = this.config.reactionDelay;
    const reactionCount = this.reactionHistory.length;
    return Math.max(baseDelay - (reactionCount * 100), 50);
  }

  executeCriticalReaction() {
    if (this.config.enableRedirection) {
      this.redirectUser();
    } else {
      this.corruptPage();
      this.spamConsole();
      this.enableFakeData();
    }
  }

  executeHighReaction() {
    this.corruptPage();
    if (this.config.enableConsoleSpam) {
      this.spamConsole();
    }
    this.enablePerformanceDegradation();
  }

  executeMediumReaction() {
    if (this.config.enableDataCorruption) {
      this.corruptData();
    }
    this.enableFakeData();
  }

  executeLowReaction() {
    if (this.config.enablePerformanceDegradation) {
      this.enablePerformanceDegradation();
    }
  }

  redirectUser() {
    const urls = [
      'https://www.google.com',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'about:blank',
      this.config.redirectUrl || 'https://www.google.com'
    ];
    
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    
    setTimeout(() => {
      window.location.replace(randomUrl);
    }, 1000);
  }

  spamConsole() {
    const fakeCode = this.generateFakeCode();
    const spamInterval = setInterval(() => {
      console.log(fakeCode);
      console.warn('System integrity check failed');
      console.error(this.config.fakeError);
      console.clear = () => {};
    }, 50);

    setTimeout(() => clearInterval(spamInterval), 10000);
  }

  generateFakeCode() {
    const patterns = [
      'function _0x',
      'var _0x',
      'const _0x',
      'let _0x',
      'return _0x'
    ];
    
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const randomHex = Math.random().toString(16).substr(2, 8);
    
    return `${randomPattern}${randomHex}();`;
  }

  corruptPage() {
    this.corruptionLevel++;
    
    const elements = document.querySelectorAll('*');
    const elementsToCorrupt = Math.min(elements.length, this.corruptionLevel * 5);
    
    for (let i = 0; i < elementsToCorrupt; i++) {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      this.corruptElement(randomElement);
    }
  }

  corruptElement(element) {
    const corruptionTypes = [
      () => element.style.opacity = Math.random(),
      () => element.style.transform = `rotate(${Math.random() * 360}deg)`,
      () => element.style.filter = 'blur(2px)',
      () => element.style.visibility = 'hidden',
      () => {
        if (element.tagName === 'INPUT') {
          element.value = 'CORRUPTED';
          element.disabled = true;
        }
      }
    ];
    
    const randomCorruption = corruptionTypes[Math.floor(Math.random() * corruptionTypes.length)];
    
    try {
      randomCorruption();
    } catch (e) {
      // Silent error handling
    }
  }

  corruptData() {
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    
    window.fetch = function(...args) {
      return originalFetch(...args).then(response => {
        if (Math.random() < 0.3) {
          return new Response(JSON.stringify({error: 'Data corrupted'}), {
            status: 500,
            headers: response.headers
          });
        }
        return response;
      });
    };
    
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalSend = xhr.send;
      
      xhr.send = function(...args) {
        if (Math.random() < 0.3) {
          setTimeout(() => {
            xhr.status = 500;
            xhr.statusText = 'Internal Server Error';
            xhr.responseText = JSON.stringify({error: 'Data corrupted'});
            if (xhr.onreadystatechange) xhr.onreadystatechange();
          }, 1000);
          return;
        }
        return originalSend.apply(this, args);
      };
      
      return xhr;
    };
  }

  enableFakeData() {
    if (this.fakeDataActive) return;
    this.fakeDataActive = true;
    
    const originalJSON = JSON.parse;
    JSON.parse = function(text) {
      try {
        const data = originalJSON(text);
        if (typeof data === 'object' && data !== null) {
          return this.injectFakeData(data);
        }
        return data;
      } catch (e) {
        return originalJSON(text);
      }
    }.bind(this);
  }

  injectFakeData(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.injectFakeData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const fakeData = { ...data };
      Object.keys(fakeData).forEach(key => {
        if (Math.random() < 0.2) {
          if (typeof fakeData[key] === 'string') {
            fakeData[key] = 'FAKE_' + fakeData[key];
          } else if (typeof fakeData[key] === 'number') {
            fakeData[key] = Math.floor(Math.random() * 1000);
          }
        }
      });
      return fakeData;
    }
    
    return data;
  }

  enablePerformanceDegradation() {
    if (this.performanceDegradationActive) return;
    this.performanceDegradationActive = true;
    
    const degradationInterval = setInterval(() => {
      const start = Date.now();
      while (Date.now() - start < 50) {
        Math.random();
      }
    }, 1000);
    
    setTimeout(() => {
      clearInterval(degradationInterval);
      this.performanceDegradationActive = false;
    }, 30000);
  }

  createDecoyElements() {
    const decoyScript = document.createElement('script');
    decoyScript.textContent = `
      // Anti-debug bypass attempt detected
      function bypassDetection() {
        console.log('Nice try!');
        return false;
      }
      
      window.debugMode = false;
      window.devtools = { open: false };
    `;
    document.head.appendChild(decoyScript);
    
    const decoyDiv = document.createElement('div');
    decoyDiv.id = 'debug-panel';
    decoyDiv.style.display = 'none';
    decoyDiv.innerHTML = '<p>Fake debug panel - you have been detected</p>';
    document.body.appendChild(decoyDiv);
  }
}