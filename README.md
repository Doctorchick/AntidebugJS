# 🛡️ AntidebugJS - Advanced Anti-Debug Protection

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/javascript-ES6+-yellow.svg" alt="JavaScript">
  <img src="https://img.shields.io/badge/security-enterprise-red.svg" alt="Security">
</p>

**AntidebugJS** is a next-generation client-side protection system designed to prevent debugging, inspection, and reverse engineering of critical JavaScript applications.

## ⚡ Quick Setup

```html
<!-- Simple: Copy-paste into your HTML -->
<script src="antidebug.js"></script>
```

```javascript
// Custom configuration
window.AntidebugConfig = {
    securityLevel: 'Ultra',  // Ultra, Balanced, Stealth
    reactions: {
        redirectUrl: 'https://yoursite.com/blocked'
    }
};
```

## 🔥 Key Features

### 🎯 **Multi-Vector Detection**
- **DevTools** - 6 advanced detection methods
- **Extensions** - React DevTools, Redux, TamperMonkey
- **Virtual environments** - Headless, automation, bots
- **Integrity** - Real-time code verification

### 🛡️ **Active Defense**
- **Dynamic obfuscation** - Encrypted variables and strings
- **Anti-tampering** - Critical function protection  
- **Progressive reactions** - From corruption to redirection
- **Decoys** - Fake code to mislead attackers

### ⚙️ **Smart Configuration**
- **3 predefined levels** - Ultra, Balanced, Stealth
- **Independent modules** - Enable what you need
- **Adjustable sensitivity** - Reduce false positives
- **Continuous monitoring** - Background surveillance

## 🚀 Protection Levels

<table>
<tr>
<td width="33%">

### 🔥 **ULTRA**
Maximum protection for critical applications
- ✅ All detections active
- ✅ Maximum sensitivity
- ✅ All reactions enabled
- ✅ Performance degradation
</td>
<td width="33%">

### ⚖️ **BALANCED** 
Optimal protection/performance balance
- ✅ Main detections
- ✅ Moderate sensitivity
- ✅ Standard reactions
- ❌ No performance degradation
</td>
<td width="33%">

### 👻 **STEALTH**
Invisible and discrete protection
- ✅ Covert detection
- ✅ Low sensitivity
- ✅ Subtle reactions
- ❌ No visible indicators
</td>
</tr>
</table>

## 🎮 Usage Examples

### Basic Configuration
```javascript
// Default usage - Balanced level
<script src="fortress.js"></script>
```

### E-commerce / Finance
```javascript
window.AntidebugConfig = {
    securityLevel: 'Ultra',
    reactions: {
        redirectUrl: 'https://mysite.com/access-denied',
        performanceDegradation: true
    }
};
```

### React/Vue Application
```javascript
window.AntidebugConfig = {
    securityLevel: 'Balanced',
    modules: {
        extensionDetection: false  // Allow React DevTools in dev
    }
};
```

### Development Mode
```javascript
window.AntidebugConfig = {
    securityLevel: 'Stealth',
    modules: {
        devtoolsDetection: false,  // Disable for debugging
        integrityCheck: true       // Keep integrity verification
    }
};
```

## 🔧 Complete Configuration

```javascript
window.AntidebugConfig = {
    // Global security level
    securityLevel: 'Balanced',  // 'Ultra' | 'Balanced' | 'Stealth'
    
    // Module activation
    modules: {
        devtoolsDetection: true,    // DevTools detection
        extensionDetection: true,   // Extension detection
        vmDetection: true,          // VM/headless detection
        integrityCheck: true,       // Integrity verification
        obfuscation: true,          // Dynamic obfuscation
        antiTampering: true         // Anti-modification protection
    },
    
    // Threat reactions
    reactions: {
        redirect: true,                              // Redirection
        redirectUrl: 'https://google.com',          // Redirect URL
        corruption: true,                           // Progressive corruption
        consoleLure: true,                          // Console decoys
        performanceDegradation: false               // Performance attacks
    },
    
    // Detection sensitivity (1-10)
    sensitivity: {
        devtools: 7,    // DevTools sensitivity
        timing: 8,      // Timing sensitivity
        window: 6       // Window sensitivity
    }
};
```

## 🔍 Detection Methods

| Technique | Description | Effectiveness |
|-----------|-------------|---------------|
| **SourceMap Abuse** | Exploits source map processing | ⭐⭐⭐⭐⭐ |
| **Scope Pane Trap** | Getter traps for variable inspection | ⭐⭐⭐⭐⭐ |
| **Performance Timing** | Measures delays caused by debugging | ⭐⭐⭐⭐ |
| **Window Geometry** | Analyzes suspicious dimensions | ⭐⭐⭐ |
| **Console Monitor** | Monitors console interactions | ⭐⭐⭐⭐ |
| **Function toString** | Detects code analysis | ⭐⭐⭐⭐ |

## ⚡ Configurable Reactions

### 🔄 **Progressive Redirection**
```javascript
// Redirection after 5 seconds with warning
reactions: {
    redirect: true,
    redirectUrl: 'https://mysite.com/blocked'
}
```

### 💥 **Gradual Corruption**
```javascript
// Progressive interface degradation
// Phase 1: Random elements hidden
// Phase 2: Animation slowdown
// Phase 3: Fake console errors
// Phase 4: Final redirection
```

### 🎭 **Console Decoys**
```javascript
// Injection of fake obfuscated code to mislead
console.log('%c(function(){var _0x1234=[\'log\',\'warn\']})();', 'color: #00ff00');
```

### 📉 **Performance Degradation**
```javascript
// Controlled memory leaks and intensive CPU operations
reactions: {
    performanceDegradation: true  // Reserved for Ultra level
}
```

## 🌐 Browser Compatibility

| Browser | Min Version | Support |
|---------|-------------|---------|
| Chrome | 70+ | ✅ Full |
| Firefox | 65+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Safari | 12+ | ⚠️ Partial |
| Opera | 57+ | ✅ Full |

## 📊 API and Monitoring

### Real-time Surveillance
```javascript
// Check protection status
const status = AntidebugJS.getStatus();
console.log(status);
// {
//   initialized: true,
//   securityLevel: 'Balanced',
//   detectionCount: 0,
//   activeModules: ['devtoolsDetection', 'integrityCheck', ...]
// }
```

### Dynamic Configuration
```javascript
// Modify configuration at runtime
AntidebugJS.configure({
    securityLevel: 'Ultra',
    sensitivity: { devtools: 10 }
});
```

### Custom Events
```javascript
// Listen to threat detections
document.addEventListener('fortressDetection', function(event) {
    console.log('Threat detected:', event.detail.type);
    // Send to your analytics system
});
```

## 🔐 Security Best Practices

### ✅ **Do**
- Always include FortressJS **after** your main code
- Use **Ultra** level for financial applications
- Implement **server-side validation** as complement
- **Test** regularly with different browsers
- **Monitor** detections to adjust sensitivity

### ❌ **Don't**
- **Never** consider client-side protection as sufficient
- Don't use **sensitive configurations** client-side
- Avoid **Ultra** level on public websites (false positives)
- Don't neglect **user experience**

## ⚠️ Important Considerations

### 🛡️ **Security**
> **Important:** FortressJS is an additional protection layer. Real security must always rely on robust server-side validation, proper authentication, and correct authorization.

### ⚖️ **Legal**
- Respect local privacy laws
- Inform users about protection measures
- Provide clear terms of service

### 🎯 **Performance**
- Initialization overhead: **< 2ms**
- Continuous monitoring impact: **< 0.1% CPU**
- Memory footprint: **< 500KB**

## 🐛 Troubleshooting

### DevTools False Positives
```javascript
// Reduce sensitivity
AntidebugConfig.sensitivity.devtools = 4;
```

### Performance Issues
```javascript
// Disable heavy modules
AntidebugConfig.modules.obfuscation = false;
AntidebugConfig.reactions.performanceDegradation = false;
```

### Development Tools Compatibility
```javascript
// Development configuration
if (window.location.hostname === 'localhost') {
    AntidebugConfig.securityLevel = 'Stealth';
    AntidebugConfig.modules.devtoolsDetection = false;
}
```

## 📈 Framework Integrations

### React
```jsx
useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
        AntidebugJS.configure({ securityLevel: 'Balanced' });
    }
}, []);
```

### Vue.js
```javascript
// main.js
if (process.env.NODE_ENV === 'production') {
    window.AntidebugConfig = { securityLevel: 'Balanced' };
}
```

### Angular
```typescript
// app.component.ts
ngOnInit() {
    if (environment.production) {
        (window as any).AntidebugJS?.configure({ securityLevel: 'Balanced' });
    }
}
```

## 🏆 Advantages vs Competition

| Feature | AntidebugJS | Original AntidebugJS | Others |
|---------|-------------|---------------------|--------|
| **Modules** | 8 specialized | 3 basic | 1-2 |
| **Detections** | 15+ methods | 5 methods | 3-8 |
| **Configuration** | 3 levels + custom | Basic | Limited |
| **Reactions** | 4 progressive types | Simple redirect | Alert/Redirect |
| **Anti-tampering** | ✅ Advanced | ❌ | ⚠️ Basic |
| **Documentation** | ✅ Complete | ⚠️ Minimal | ❌ |

## 🤝 Support and Contribution

### 📞 **Support**
- [GitHub Issues](https://github.com/username/antidebugjs/issues)
- [Discussions](https://github.com/username/antidebugjs/discussions)
- [Wiki](https://github.com/username/antidebugjs/wiki)

### 🔧 **Development**
```bash
git clone https://github.com/doctorchick/antidebugjs.git
cd antidebugjs
npm install
npm test
npm run build
```

### 🏷️ **License**

![License: MIT (Non-Commercial)](https://img.shields.io/badge/license-MIT--NC-blue.svg)

This script is distributed under a modified MIT license (non-commercial use only).  
You are free to use, modify, and share it as long as it is **not for commercial purposes**.  
Please give credit if you reuse the project. ❤️  
Made by **SamK / Doctorchick**
---

<p align="center">
  <strong>⭐ If AntidebugJS protects your application, give it a star on GitHub!</strong><br>
  <sub>Last updated: August 2025</sub>
</p>