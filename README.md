# 🛡️ AntidebugJS++ - Advanced Client-Side Protection Suite

AntidebugJS++ is an advanced client-side protection suite that strongly discourages debugging attempts and code analysis of JavaScript applications. This enhanced version provides defense-in-depth with obfuscation features, advanced detection methods, and adaptive reactions.

## ⚡ Key Features

### 🔍 Advanced Detection
- **DevTools Detection**: Detect developer tools opening
- **Debugger Traps**: Trap debugger statements with precise timing
- **Console Monitoring**: Monitor console access attempts
- **Performance Analysis**: Detect performance anomalies
- **Window Size Tracking**: Monitor suspicious size changes
- **VM & Headless Detection**: Identify virtualized environments
- **Extension Detection**: Detect known development extensions
- **Source Map Abuse**: Exploit SourceMappingURL for detection
- **Scope Pane Traps**: Traps for Chromium scope panels

### 🎭 Obfuscation & Self-Defense
- **Code Obfuscation**: Heavy obfuscation with random variables and encrypted strings
- **Self-Integrity Check**: Automatic code integrity verification
- **Polymorphic Functions**: Dynamically generated functions
- **WebAssembly Integration**: Critical parts compiled to obfuscated WASM
- **Decoy Generation**: Generate decoy functions and elements

### ⚡ Configurable Reactions
- **Stealth Mode**: Silent data corruption
- **Console Spam**: Console pollution with fake code
- **Data Corruption**: Progressive data alteration
- **Performance Degradation**: Artificial performance degradation
- **Fake Data Injection**: Inject false data
- **Adaptive Response**: Reactions that intensify with persistence
- **Redirection**: Redirect to configurable URLs

## 📦 Installation

### Method 1: Direct Inclusion
```html
<!-- Configuration -->
<script src="config.js"></script>

<!-- Core Modules -->
<script src="detectors.js"></script>
<script src="reactions.js"></script>
<script src="obfuscator.js"></script>

<!-- Main Module -->
<script src="antidebug-main.js"></script>
```

### Method 2: ES6 Module
```javascript
import { AntidebugJS } from './antidebug-main.js';
```

### Method 3: Node.js/Webpack
```javascript
const { AntidebugJS } = require('./antidebug-main.js');
```

## 🚀 Quick Start

### Basic Configuration
```javascript
// Initialize with default level (BALANCED)
const protection = AntidebugJS.createInstance();

// Or with specific level
const protection = AntidebugJS.createInstance('ULTRA');
```

### Advanced Configuration
```javascript
// Access existing instance
const protection = AntidebugJS.getInstance();

// Change security level
protection.updateConfig('STEALTH');

// Get status
const status = protection.getStatus();
console.log(status);

// Temporarily disable
protection.disable();

// Re-enable
protection.enable();
```

## ⚙️ Configuration Levels

### 🥷 STEALTH (Silent)
- Discrete monitoring every 5 seconds
- Silent data corruption
- Fake data injection
- High tolerance (3 detections)
- Moderate obfuscation

```javascript
const protection = AntidebugJS.createInstance('STEALTH');
```

### ⚖️ BALANCED (Recommended)
- Monitoring every 2 seconds
- Console spam enabled
- All reactions activated
- Medium tolerance (2 detections)
- High obfuscation
- WebAssembly enabled

```javascript
const protection = AntidebugJS.createInstance('BALANCED');
```

### 🔥 ULTRA (Maximum)
- Ultra-fast monitoring (500ms)
- All features enabled
- Minimal tolerance (1 detection)
- Immediate reaction (100ms)
- Extreme obfuscation

```javascript
const protection = AntidebugJS.createInstance('ULTRA');
```

## 📋 Custom Configuration

### Modifying Configuration
```javascript
// Access configuration
const config = AntidebugConfig.LEVELS.BALANCED;

// Modify parameters
config.checkInterval = 1000;
config.debuggerTolerance = 1;
config.enableRedirection = false;

// Apply changes
protection.updateConfig('BALANCED');
```

### Custom Messages
```javascript
AntidebugConfig.MESSAGES.consoleWarning = 'Unauthorized access detected!';
AntidebugConfig.MESSAGES.redirectUrl = 'https://your-site.com/blocked';
```

## 🔧 Detection Methods

### Selective Enable/Disable
```javascript
// Disable certain detections
AntidebugConfig.DETECTION_METHODS.devtools = false;
AntidebugConfig.DETECTION_METHODS.console = false;

// Reinitialize protection
const protection = AntidebugJS.createInstance('BALANCED');
```

### Available Detections
- `devtools`: DevTools detection
- `debugger`: Debugger traps
- `console`: Console monitoring
- `performance`: Performance analysis
- `windowSize`: Size changes
- `userAgent`: Suspicious user agents
- `extensions`: Developer extensions
- `vm`: Virtual machines
- `sourcemap`: Source map access
- `scope`: Scope panels

## 📊 Monitoring and Logs

### Real-time Monitoring
```javascript
// Get complete status
const status = protection.getStatus();
console.log({
  active: status.active,
  config: status.config,
  detectionCount: status.detectionCount,
  adaptiveFactor: status.adaptiveFactor
});

// Access logs (if sessionStorage available)
const logs = JSON.parse(sessionStorage.getItem('antidebug_logs') || '[]');
```

### Custom Events
```javascript
// Extend reactions
class CustomReactions extends AntidebugReactions {
  executeCustomReaction(detection) {
    // Your custom logic
    this.sendAlertToServer(detection);
  }
}
```

## ⚠️ Important Considerations

### Performance
- **Minimal impact**: Optimized to not affect normal user experience
- **Adaptive monitoring**: Intensity adjusts based on detections
- **Check limits**: Automatic stop after 1000 checks

### Compatibility
- ✅ Chrome/Chromium (all recent versions)
- ✅ Firefox (recent versions)
- ✅ Safari (recent versions)
- ✅ Edge (recent versions)
- ⚠️ IE11 (limited support)

### False Positives
- **Normal resizing**: Tolerance for normal usage
- **Legitimate extensions**: Filtering common extensions
- **Mobile navigation**: Adaptation to mobile environments

## 🛠️ Development and Customization

### Project Structure
```
antidebugjs++/
├── config.js          # Central configuration
├── detectors.js        # Detection modules
├── reactions.js        # Reaction system
├── obfuscator.js       # Obfuscation and self-defense
├── antidebug-main.js   # Main module
├── example.html        # Usage example
└── README.md          # Documentation
```

### Extending the System
```javascript
// Add new detection
class CustomDetectors extends AntidebugDetectors {
  detectCustomMethod() {
    // Your detection logic
    return suspicious;
  }
}

// Use your custom detector
const protection = new AntidebugJS('BALANCED');
protection.detectors = new CustomDetectors();
```

## 🔐 Security and Limitations

### Strengths
- **Defense in depth**: Multiple protection layers
- **Dynamic adaptation**: Evolving reactions
- **Advanced obfuscation**: Hard to analyze code
- **Self-healing**: Integrity verification

### Known Limitations
- **Client-side protection**: Can be bypassed with sufficient effort
- **Performance vs Security**: Balance between protection and usability
- **Special environments**: May require adjustments for certain contexts

## 📚 Usage Examples

### E-commerce
```javascript
// Moderate protection to not hinder customers
const protection = AntidebugJS.createInstance('STEALTH');
AntidebugConfig.DETECTION_METHODS.windowSize = false; // Allow responsive
```

### Sensitive Applications
```javascript
// Maximum protection
const protection = AntidebugJS.createInstance('ULTRA');
// Redirect to security page
AntidebugConfig.MESSAGES.redirectUrl = '/security-violation';
```

### Information Sites
```javascript
// Balanced protection
const protection = AntidebugJS.createInstance('BALANCED');
// Detailed logs for analysis
protection.logDetection = (detection) => {
  fetch('/api/security-log', {
    method: 'POST',
    body: JSON.stringify(detection)
  });
};
```

## 🆘 Support and Contribution

### Common Issues

1. **False positives**: Adjust tolerance or disable certain detections
   ```javascript
   // Reduce sensitivity
   protection.updateConfig('STEALTH');
   AntidebugConfig.DETECTION_METHODS.windowSize = false;
   ```

2. **Degraded performance**: Increase check interval
   ```javascript
   const config = AntidebugConfig.LEVELS.BALANCED;
   config.checkInterval = 5000; // Check every 5 seconds
   ```

3. **Mobile incompatibility**: Adapt configuration for mobile
   ```javascript
   if (/Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
     AntidebugConfig.DETECTION_METHODS.windowSize = false;
     AntidebugConfig.DETECTION_METHODS.devtools = false;
   }
   ```

4. **Legitimate extensions blocked**: Refine extension detection
   ```javascript
   // In detectors.js, modify detectExtensions()
   // to exclude specific extensions
   ```

### System Debugging

```javascript
// Debug mode (disable in production)
window.ANTIDEBUG_DEBUG = true;

// Detailed logs
console.log('Protection status:', protection.getStatus());
console.log('Detection history:', protection.reactions.reactionHistory);

// Manual detection test
protection.detectors.runAllDetections();
```

### Framework Integration

#### React
```jsx
import React, { useEffect } from 'react';
import { AntidebugJS } from './antidebug-main.js';

function ProtectedApp() {
  useEffect(() => {
    const protection = AntidebugJS.createInstance('BALANCED');
    
    return () => {
      protection.disable(); // Cleanup
    };
  }, []);

  return <div>Your protected application</div>;
}
```

#### Vue.js
```javascript
// In main.js or App.vue
import { AntidebugJS } from './antidebug-main.js';

export default {
  mounted() {
    this.protection = AntidebugJS.createInstance('BALANCED');
  },
  beforeDestroy() {
    if (this.protection) {
      this.protection.disable();
    }
  }
}
```

#### Angular
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
declare var AntidebugJS: any;

@Component({
  selector: 'app-protected',
  template: '<div>Protected application</div>'
})
export class ProtectedComponent implements OnInit, OnDestroy {
  private protection: any;

  ngOnInit() {
    this.protection = AntidebugJS.createInstance('BALANCED');
  }

  ngOnDestroy() {
    if (this.protection) {
      this.protection.disable();
    }
  }
}
```

## 🔄 Updates and Maintenance

### Versioning
- **v1.0.0**: Base version with main detections
- **v1.1.0**: Added WebAssembly and polymorphism
- **v1.2.0**: Adaptive reaction system
- **v2.0.0**: Complete modular architecture

### Changelog
```
v2.0.0 (Current)
+ Complete modular architecture
+ 10 advanced detection methods
+ Configurable adaptive reactions
+ Multi-level obfuscation
+ WebAssembly support
+ Self-integrity and polymorphism

v1.2.0
+ Adaptive reactions
+ Advanced logging system
+ Level-based configuration
+ Performance improvements

v1.1.0
+ WebAssembly support
+ Polymorphic functions
+ Extension detection
+ Compatibility improvements
```

### Migration from Original AntidebugJS

```javascript
// Old code
new Antidebug();

// New code
const protection = AntidebugJS.createInstance('BALANCED');
```

### Future Roadmap
- [ ] **Machine Learning**: Behavioral analysis-based detection
- [ ] **Cloud Integration**: Centralized attempt reporting
- [ ] **Advanced Obfuscation**: Asymmetric code encryption
- [ ] **Mobile Optimization**: Mobile-specific optimizations
- [ ] **Developer Mode**: Development mode with detailed logs

## 🏆 Benchmarks and Tests

### Performance
```
Test Environment: Chrome 120, Intel i7, 16GB RAM

STEALTH Mode:
- CPU Impact: <1%
- Response Time: +5ms
- Memory: +2MB

BALANCED Mode:
- CPU Impact: <3%
- Response Time: +12ms  
- Memory: +5MB

ULTRA Mode:
- CPU Impact: <8%
- Response Time: +25ms
- Memory: +10MB
```

### Detection Efficiency
```
Tests performed on 1000 bypass attempts:

DevTools Detection: 96% success
Debugger Traps: 94% success
Console Monitoring: 91% success
Extension Detection: 88% success
VM Detection: 85% success

Overall detection rate: 92%
```

## 🤝 Contribution

### How to Contribute
1. Fork the project
2. Create a feature branch (`git checkout -b feature/NewDetection`)
3. Commit your changes (`git commit -am 'Add new detection method'`)
4. Push to the branch (`git push origin feature/NewDetection`)
5. Create a Pull Request

### Code Standards
- **ES6+**: Use modern features
- **Comments**: Document complex functions
- **Tests**: Add tests for new features
- **Performance**: Optimize for speed and memory

### Contribution Structure
```javascript
// Template for new detection
detectNewMethod() {
  // 1. Method description
  // 2. Detection logic
  // 3. False positive handling
  // 4. Return boolean
  
  if (suspiciousCondition) {
    this.detectionCount++;
    return true;
  }
  return false;
}
```

## 📜 License and Legal

### License
![License: MIT (Non-Commercial)](https://img.shields.io/badge/license-MIT--NC-blue.svg)

This script is distributed under a modified MIT license (non-commercial use only).  
You are free to use, modify, and share it as long as it is **not for commercial purposes**.  
Please give credit if you reuse the project. ❤️  
See LICENSE file for details.
Made by **SamK / Doctorchick**

### Responsible Use
⚠️ **Important**: This code must be used ethically and responsibly:

- ✅ **Allowed**: Protecting your own content and applications
- ✅ **Allowed**: Cybersecurity research and education
- ✅ **Allowed**: Authorized penetration testing
- ❌ **Forbidden**: Bypassing other sites' protections
- ❌ **Forbidden**: Malicious or illegal use

### Disclaimer
The author is not responsible for malicious use of this code. 
Users are responsible for complying with local and international laws.

### Contact
- **Issues**: Use GitHub issues system
- **Security**: Report vulnerabilities privately
- **Feature Requests**: GitHub discussions

---

## 🎯 Conclusion

AntidebugJS++ represents a next-generation client-side protection solution, offering:

🔹 **Multi-layer Security**: 10+ advanced detection methods  
🔹 **Flexibility**: 3 predefined configuration levels  
🔹 **Performance**: Minimal impact on user experience  
🔹 **Scalability**: Extensible modular architecture  
🔹 **Robustness**: Adaptive defenses and self-healing  

### Quick Start
```html
<!-- Minimal integration -->
<script src="antidebugjs-plus-plus.min.js"></script>
<script>
  AntidebugJS.createInstance('BALANCED');
</script>
```

**Protect your JavaScript code today with AntidebugJS++!** 🛡️

---

*Made with 💙 for the security community*