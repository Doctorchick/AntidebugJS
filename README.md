# AntidebugJS 3.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-3.5.0-blue.svg)]()
[![Browser Support](https://img.shields.io/badge/Browser%20Support-Chrome%2C%20Firefox%2C%20Safari%2C%20Edge-green.svg)]()

**Industrial-grade anti-debugging and code protection solution for JavaScript applications.**

AntidebugJS is a comprehensive, single-file solution designed to protect your JavaScript applications from reverse engineering, debugging, and unauthorized analysis. It combines advanced detection techniques, intelligent reactions, and stealth capabilities to provide robust protection against various attack vectors.

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="antidebugjs.min.js"></script>
</head>
<body>
    <script>
        // Simple initialization with default settings
        const protection = new AntidebugJS();
        protection.start();
    </script>
</body>
</html>
```

### JSON Configuration

```html
<script data-antidebug-config type="application/json">
{
    "level": "balanced",
    "detectionMethods": {
        "devtools": { "enabled": true, "sensitivity": 0.8, "interval": 1000 },
        "console": { "enabled": true, "sensitivity": 0.9, "interval": 500 }
    },
    "reactions": {
        "onDetection": [
            { "type": "log", "severity": "warn" },
            { "type": "callback", "function": "myDetectionHandler" }
        ]
    }
}
</script>
```

### Preset-based Initialization

```javascript
// Stealth mode - maximum protection
const stealth = AntidebugJS.create('stealth');

// Balanced mode - performance/protection balance
const balanced = AntidebugJS.create('balanced');

// Aggressive mode - strong protection with reactions
const aggressive = AntidebugJS.create('aggressive', {
    reactions: {
        onDetection: [
            { type: 'redirect', url: '/blocked.html' }
        ]
    }
});

stealth.start();
```

## 🔧 Configuration

### Detection Methods

| Method | Description | Default Sensitivity | Default Interval |
|--------|-------------|-------------------|------------------|
| `devtools` | DevTools timing analysis | 0.8 | 1000ms |
| `console` | Console access detection | 0.9 | 500ms |
| `timing` | Advanced timing analysis | 0.7 | 2000ms |
| `extensions` | Browser extension detection | 0.6 | 3000ms |
| `headless` | Headless browser detection | 0.8 | 5000ms |
| `behavior` | Behavioral analysis | 0.5 | 10000ms |

### Reaction Types

| Type | Description | Parameters |
|------|-------------|------------|
| `log` | Console logging | `severity`: 'info', 'warn', 'error' |
| `callback` | Custom function execution | `function`: callback function |
| `obfuscate` | Code obfuscation | None |
| `slowdown` | Performance degradation | None |
| `corrupt` | Data corruption | None |
| `redirect` | Page redirection | `url`: target URL |

### Complete Configuration Schema

```json
{
  "level": "balanced",
  "detectionMethods": {
    "devtools": {
      "enabled": true,
      "sensitivity": 0.8,
      "interval": 1000
    },
    "console": {
      "enabled": true,
      "sensitivity": 0.9,
      "interval": 500
    },
    "timing": {
      "enabled": true,
      "sensitivity": 0.7,
      "interval": 2000
    },
    "extensions": {
      "enabled": true,
      "sensitivity": 0.6,
      "interval": 3000
    },
    "headless": {
      "enabled": true,
      "sensitivity": 0.8,
      "interval": 5000
    },
    "behavior": {
      "enabled": false,
      "sensitivity": 0.5,
      "interval": 10000
    }
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
}
```

## 🛡️ Features

### Advanced Detection Capabilities

#### DevTools Detection
- **Timing-based analysis**: Measures execution time differences when DevTools is open
- **Multiple measurement points**: Uses 5 different timing tests for accuracy
- **Variance analysis**: Detects timing inconsistencies caused by debugging
- **Adaptive sensitivity**: Adjustable threshold based on environment

#### Console Access Detection
- **Hook detection**: Identifies modified console functions
- **Responsiveness testing**: Measures console operation timing
- **Function integrity**: Verifies native code signatures
- **Access pattern analysis**: Monitors unusual console usage

#### Advanced Timing Analysis
- **Multi-layered testing**: Combines execution, rendering, and memory tests
- **Rendering performance**: Canvas drawing performance analysis
- **Memory pressure testing**: Heap allocation monitoring
- **Statistical analysis**: Variance and anomaly detection

#### Browser Extensions Detection
- **Developer tool extensions**: React, Vue, Redux, Angular DevTools
- **Userscript managers**: Tampermonkey, Greasemonkey
- **Security extensions**: Ad blockers, privacy tools
- **Custom extension detection**: Extensible detection framework

#### Headless Browser Detection
- **Puppeteer detection**: Multiple Puppeteer-specific indicators
- **Selenium detection**: WebDriver and automation signatures
- **PhantomJS detection**: Legacy headless browser identification
- **Environment analysis**: Missing APIs and unusual configurations

#### Behavioral Analysis
- **User interaction patterns**: Mouse movement, clicks, keyboard input
- **Timing entropy**: Randomness analysis of user actions
- **Frequency analysis**: Unusual interaction rates
- **Machine learning inspired**: Anomaly scoring algorithms

### Intelligent Reaction System

#### Graduated Response
- **Escalation levels**: Progressive response based on detection count
- **Threshold-based actions**: Configurable reaction triggers
- **Multi-vector reactions**: Combine different countermeasures
- **Adaptive responses**: Learn from previous detections

#### Protection Mechanisms
- **Code obfuscation**: Runtime string encryption and dead code injection
- **Performance degradation**: Subtle slowdown to frustrate attackers
- **Data corruption**: Selective data poisoning
- **Page redirection**: Immediate removal from protected content

### Stealth Operations

#### Anti-Detection
- **Function name obfuscation**: Hide constructor and method names
- **Anti-hooking protection**: Detect and prevent function modifications
- **Polymorphic behavior**: Change detection patterns over time
- **Silent operation**: Minimal console output and error handling

#### Code Protection
- **Runtime obfuscation**: Dynamic code transformation
- **String encryption**: Base64 and XOR string protection
- **Control flow obfuscation**: Complex execution paths
- **Integrity monitoring**: Detect code modifications

## 📊 API Reference

### Constructor

```javascript
const protection = new AntidebugJS(config);
```

### Methods

#### `start()`
Begins protection monitoring
```javascript
protection.start();
```

#### `stop()`
Stops all protection activities
```javascript
protection.stop();
```

#### `updateConfig(newConfig)`
Updates configuration dynamically
```javascript
protection.updateConfig({
  detectionMethods: {
    devtools: { sensitivity: 1.0 }
  }
});
```

#### `getStatus()`
Returns current protection status
```javascript
const status = protection.getStatus();
// Returns: { active: true, detections: {...}, config: "balanced", methods: [...] }
```

### Events

#### `on(event, callback)`
Listen for protection events
```javascript
protection.on('detection', (event) => {
  console.log('Detection:', event.method, event.confidence);
});

protection.on('started', () => {
  console.log('Protection started');
});

protection.on('stopped', () => {
  console.log('Protection stopped');
});
```

## 🎯 Use Cases

### Web Application Protection
```javascript
// E-commerce fraud prevention
const protection = AntidebugJS.create('aggressive', {
  reactions: {
    onDetection: [
      { type: 'log', severity: 'error' },
      { type: 'callback', function: reportSuspiciousActivity }
    ],
    escalation: {
      enabled: true,
      steps: [
        { threshold: 2, actions: ['obfuscate'] },
        { threshold: 4, actions: ['redirect'] }
      ]
    }
  },
  telemetry: {
    enabled: true,
    endpoint: '/api/security-events',
    apiKey: 'your-api-key'
  }
});

function reportSuspiciousActivity(event) {
  fetch('/api/fraud-alert', {
    method: 'POST',
    body: JSON.stringify({
      type: 'debugging_attempt',
      details: event,
      timestamp: Date.now()
    })
  });
}
```

### Gaming Anti-Cheat
```javascript
// Browser game protection
const gameProtection = AntidebugJS.create('stealth', {
  detectionMethods: {
    behavior: { enabled: true, sensitivity: 0.8 },
    timing: { enabled: true, sensitivity: 1.0 }
  },
  reactions: {
    onDetection: [
      { type: 'callback', function: flagCheatingAttempt },
      { type: 'corrupt' }
    ]
  }
});

function flagCheatingAttempt(event) {
  gameState.playerFlags.push({
    type: 'anti_debug',
    confidence: event.confidence,
    timestamp: Date.now()
  });
}
```

### Content Protection
```javascript
// Educational content protection
const contentProtection = AntidebugJS.create('balanced', {
  reactions: {
    onDetection: [
      { type: 'obfuscate' },
      { type: 'slowdown' }
    ],
    escalation: {
      steps: [
        { threshold: 1, actions: ['redirect'] }
      ]
    }
  }
});
```

## 🔧 Advanced Usage

### Custom Detection Methods
```javascript
class CustomProtection extends AntidebugJS {
  constructor(config) {
    super(config);
    
    // Add custom detector
    this.detectors.custom = this.customDetector.bind(this);
  }
  
  customDetector() {
    // Your custom detection logic
    const suspicious = window.myApp && window.myApp.debugMode;
    
    return {
      detected: suspicious,
      confidence: suspicious ? 1.0 : 0,
      metadata: { debugMode: suspicious }
    };
  }
}
```

### Integration with Frameworks

#### React Integration
```javascript
import { useEffect } from 'react';

function useAntidebug(config = {}) {
  useEffect(() => {
    const protection = AntidebugJS.create('balanced', config);
    protection.start();
    
    return () => protection.stop();
  }, []);
}

// Usage in component
function MyComponent() {
  useAntidebug({
    reactions: {
      onDetection: [{ type: 'log', severity: 'warn' }]
    }
  });
  
  return <div>Protected Content</div>;
}
```

#### Vue Integration
```javascript
// Vue plugin
const AntidebugPlugin = {
  install(app, options = {}) {
    const protection = AntidebugJS.create('balanced', options);
    app.config.globalProperties.$antidebug = protection;
    
    app.mixin({
      beforeCreate() {
        if (!this.$options.antidebug) return;
        protection.start();
      },
      beforeUnmount() {
        protection.stop();
      }
    });
  }
};
```

## 📈 Performance Considerations

### Impact Analysis
- **Memory footprint**: ~50KB compressed
- **CPU overhead**: <5% in balanced mode
- **Network overhead**: <1KB/hour with telemetry
- **Initialization time**: <50ms

### Optimization Tips
1. **Adjust intervals**: Increase detection intervals for better performance
2. **Selective methods**: Disable unnecessary detection methods
3. **Sensitivity tuning**: Lower sensitivity reduces false positives
4. **Telemetry batching**: Use larger batch sizes for telemetry

### Performance Monitoring
```javascript
const protection = AntidebugJS.create('balanced');

protection.on('detection', (event) => {
  console.log('Detection time:', event.metadata.executionTime);
});

// Monitor memory usage
setInterval(() => {
  if (performance.memory) {
    console.log('Memory usage:', performance.memory.usedJSHeapSize);
  }
}, 30000);
```

## 🔐 Security Best Practices

### Deployment Security
1. **Obfuscation**: Always use code obfuscation in production
2. **HTTPS only**: Never deploy over HTTP
3. **CSP headers**: Implement Content Security Policy
4. **API keys**: Rotate telemetry API keys regularly

### Configuration Security
```javascript
// Secure configuration
const secureConfig = {
  level: 'stealth',
  stealth: {
    hideFromDevtools: true,
    antiHooking: true,
    polymorphic: true
  },
  obfuscation: {
    enabled: true,
    stringEncryption: true,
    deadCodeInjection: true
  },
  reactions: {
    escalation: {
      enabled: true,
      steps: [
        { threshold: 1, actions: ['obfuscate'] },
        { threshold: 2, actions: ['redirect'] }
      ]
    }
  }
};
```

### Monitoring and Alerting
```javascript
// Security event monitoring
protection.on('detection', (event) => {
  // Log security events
  fetch('/api/security-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: 'anti_debug_detection',
      method: event.method,
      confidence: event.confidence,
      user_agent: navigator.userAgent,
      timestamp: Date.now()
    })
  });
});
```

## 📋 Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 60+ | Full |
| Firefox | 55+ | Full |
| Safari | 12+ | Full |
| Edge | 79+ | Full |
| IE | 11 | Limited |

### Feature Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| DevTools Detection | ✅ | ✅ | ✅ | ✅ |
| Console Detection | ✅ | ✅ | ✅ | ✅ |
| Timing Analysis | ✅ | ✅ | ⚠️ | ✅ |
| Extension Detection | ✅ | ✅ | ❌ | ✅ |
| Headless Detection | ✅ | ✅ | ✅ | ✅ |
| Behavioral Analysis | ✅ | ✅ | ✅ | ✅ |

## 🐛 Troubleshooting

### Common Issues

#### False Positives
```javascript
// Reduce sensitivity to minimize false positives
const protection = AntidebugJS.create('balanced', {
  detectionMethods: {
    devtools: { sensitivity: 0.5 },
    timing: { sensitivity: 0.4 }
  }
});
```

#### Performance Issues
```javascript
// Optimize for performance
const optimized = AntidebugJS.create('balanced', {
  detectionMethods: {
    behavior: { enabled: false }, // Most CPU intensive
    timing: { interval: 5000 },   // Less frequent checks
    headless: { interval: 10000 } // Least critical
  }
});
```

#### Integration Problems
```javascript
// Debug mode for development
const debug = new AntidebugJS({
  level: 'balanced',
  reactions: {
    onDetection: [
      { type: 'log', severity: 'info' } // Log only, no actions
    ]
  }
});

debug.on('detection', (event) => {
  console.log('Debug detection:', event);
});
```

## 📄 License
![License: MIT (Non-Commercial)](https://img.shields.io/badge/license-MIT--NC-blue.svg)

This script is distributed under a modified MIT license (non-commercial use only).  
You are free to use, modify, and share it as long as it is **not for commercial purposes**.  
Please give credit if you reuse the project. ❤️  
See LICENSE file for details.
Made by **SamK / Doctorchick**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

- Documentation: [https://antidebugjs.com/docs](https://antidebugjs.com/docs)
- Issues: [https://github.com/antidebugjs/antidebug/issues](https://github.com/antidebugjs/antidebug/issues)
- Discussions: [https://github.com/antidebugjs/antidebug/discussions](https://github.com/antidebugjs/antidebug/discussions)

## 🔄 Changelog

### v3.0.0
- Complete rewrite with TypeScript
- Single-file implementation
- JSON configuration support
- Advanced behavioral analysis
- Improved stealth capabilities
- Enhanced performance optimization
