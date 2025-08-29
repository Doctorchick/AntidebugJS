# Anti-Debug Protection Script

A comprehensive JavaScript protection system against debugging attempts, code inspection, and manipulation. Designed to protect sensitive web pages from analysis and reverse engineering.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Pre-built Configurations](#pre-built-configurations)
- [Protection Methods](#protection-methods)
- [Customization](#customization)
- [Browser Compatibility](#browser-compatibility)
- [Limitations](#limitations)
- [Warnings](#warnings)
- [FAQ](#faq)

## Features

### Interface Protection
- **Right-click disabled** - Prevents access to context menu
- **Selection protection** - Blocks text selection and drag-and-drop
- **Keyboard shortcuts blocked** - F12, Ctrl+Shift+I, Ctrl+U, etc.
- **Advanced CSS protection** - Injected styles to reinforce protection

### Advanced Detection
- **DevTools by window size** - Detects developer tools opening
- **Performance analysis** - Identifies suspicious slowdowns
- **Breakpoint detection** - Spots breakpoints in code execution
- **Extension monitoring** - Detects development extensions

### Anti-debugging
- **Multiple debugger statements** - Several instances for increased efficiency
- **Function obfuscation** - Hides sensitive function names
- **Console spam** - Floods console with protection messages
- **Global property protection** - Prevents modification of critical variables

### System Monitoring
- **DOM integrity** - Checks for HTML code modifications
- **JavaScript status** - Detects JavaScript disabling
- **Continuous monitoring** - Real-time surveillance

## Installation

### Simple Installation
```html
<!-- Add before closing </head> tag -->
<script src="path/to/anti-debug-protection.js"></script>
```

### Inline Installation
```html
<script>
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        redirectUrl: 'about:blank',
        reloadOnTamper: true,
        alertEnabled: false,
        consoleSpamInterval: 1000,
        devToolsCheckInterval: 500,
        performanceThreshold: 50
    };
    
    // ... rest of protection code
})();
</script>
```

## Configuration

The script uses a centralized configuration object to customize its behavior:

```javascript
const CONFIG = {
    // URLs and redirections
    redirectUrl: 'about:blank',         // Redirect page on detection
    
    // Behaviors
    reloadOnTamper: true,               // true = reload, false = redirect
    alertEnabled: false,                // Show popup alerts
    
    // Check intervals (milliseconds)
    consoleSpamInterval: 1000,          // Console spam frequency
    devToolsCheckInterval: 500,         // DevTools detection interval
    performanceThreshold: 50            // Performance detection threshold (ms)
};
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `redirectUrl` | string | `'about:blank'` | Redirect URL |
| `reloadOnTamper` | boolean | `true` | Reload vs redirect |
| `alertEnabled` | boolean | `false` | Show alerts |
| `consoleSpamInterval` | number | `1000` | Console spam interval (ms) |
| `devToolsCheckInterval` | number | `500` | DevTools detection interval (ms) |
| `performanceThreshold` | number | `50` | Performance threshold (ms) |

## Pre-built Configurations

### Ultra-Secure
```javascript
const CONFIG = {
    redirectUrl: 'about:blank',
    reloadOnTamper: true,
    alertEnabled: true,
    consoleSpamInterval: 500,
    devToolsCheckInterval: 200,
    performanceThreshold: 30
};
```
**Use case:** Highly sensitive data sites, banking applications

### Balanced (Recommended)
```javascript
const CONFIG = {
    redirectUrl: '/protected-page.html',
    reloadOnTamper: false,
    alertEnabled: false,
    consoleSpamInterval: 1000,
    devToolsCheckInterval: 500,
    performanceThreshold: 50
};
```
**Use case:** Standard websites, online stores

### Professional
```javascript
const CONFIG = {
    redirectUrl: 'https://yoursite.com/access-denied',
    reloadOnTamper: false,
    alertEnabled: false,
    consoleSpamInterval: 2000,
    devToolsCheckInterval: 1000,
    performanceThreshold: 75
};
```
**Use case:** Corporate websites, client portals

### Gaming/Interactive
```javascript
const CONFIG = {
    redirectUrl: 'https://example.com/oops',
    reloadOnTamper: true,
    alertEnabled: false,
    consoleSpamInterval: 1500,
    devToolsCheckInterval: 750,
    performanceThreshold: 60
};
```
**Use case:** Online games, interactive applications

## Protection Methods

### User Interface
- Context menu disabling (right-click)
- Text selection blocking
- Drag and drop protection
- CSS protection injection

### Blocked Keyboard Shortcuts
- `F12` - Developer tools
- `Ctrl+Shift+I` - Element inspector
- `Ctrl+Shift+J` - JavaScript console
- `Ctrl+U` - View page source
- `Ctrl+Shift+C` - Element selector
- `Ctrl+A` - Select all
- `Ctrl+S` - Save page

### Technical Detection
- **Window size** - Detects DevTools opening by size changes
- **Performance** - Measures execution times to detect breakpoints
- **Console** - Monitors console usage attempts
- **DOM** - Verifies HTML code integrity
- **Extensions** - Detects common development extensions

### Anti-debugging
- Multiple `debugger` statements
- Function name obfuscation
- Base64 encoded code
- Object property protection
- Console spam to mask information

## Customization

### Creating Custom Configuration
```javascript
const CUSTOM_CONFIG = {
    // Custom redirection
    redirectUrl: 'https://mysite.com/error-403',
    
    // No intrusive alerts
    alertEnabled: false,
    
    // Moderate monitoring
    devToolsCheckInterval: 800,
    performanceThreshold: 60,
    
    // Discrete console spam
    consoleSpamInterval: 1500
};
```

### Adding Custom Detections
```javascript
// Example addition in initialize() function
function detectCustomTools() {
    createInterval(function() {
        // Your custom detection logic
        if (window.myCustomDetection) {
            handleTamperDetection('Custom tool detected');
        }
    }, 3000);
}

// Add it in initialize()
function initialize() {
    // ... other initializations
    detectCustomTools(); // Add your function
}
```

## Browser Compatibility

### Supported Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Opera 47+

### Environments
- Desktop (Windows, macOS, Linux)
- Mobile (iOS Safari, Android Chrome)
- Tablets
- Very old browsers (reduced protection)

### Compatible Frameworks
- Static sites (HTML/CSS/JS)
- React, Vue, Angular
- WordPress, Drupal
- E-commerce sites (Shopify, etc.)

## Limitations

### Technical
- **Not 100% protection** - Experienced developers can bypass
- **Performance impact** - Continuous monitoring consumes resources
- **False positives** - May trigger on some legitimate interactions
- **Legitimate extensions** - May detect non-debug related extensions

### User Experience
- **Accessibility** - May interfere with some accessibility tools
- **Keyboard navigation** - Some shortcuts are blocked
- **Copy-paste** - Text selection limitation

### Possible Bypass Methods
- JavaScript disabling (handled by script)
- Server-side source code modification
- External tools usage
- Network interception

## Warnings

### Legal
- **Check legality** in your jurisdiction
- **Inform users** of active protection
- **Respect privacy** - Don't collect sensitive data

### Ethical
- **Legitimate use only** - Protecting proprietary content
- **No malicious intent** - Don't use to hide malicious code
- **User experience** - Balance security and usability

### Performance
- **Test performance** on different devices
- **Battery impact** on mobile devices
- **Slow sites** - Adjust intervals if necessary

## FAQ

### **Q: Can the script be disabled?**
A: Yes, users can always disable JavaScript or modify server-side code. This script increases difficulty but doesn't offer absolute protection.

### **Q: SEO impact?**
A: Minimal if properly configured. Search engine crawlers are generally not affected by these protections.

### **Q: CDN compatible?**
A: Yes, the script can be hosted on a CDN. Ensure the `redirectUrl` path is accessible.

### **Q: What about false positives?**
A: Increase `performanceThreshold` and `devToolsCheckInterval` values, or temporarily disable `alertEnabled`.

### **Q: Mobile protection?**
A: Yes, but adjust intervals to preserve battery life. Mobile DevTools are less common.

### **Q: HTTPS required?**
A: Not required but recommended for overall security. Some advanced features may need HTTPS.

### **Q: How to debug the script itself?**
A: Add a `debugMode: true` option in configuration and create a development version with detailed logging.

---

## License

This script is provided "as is" without warranty. Use at your own responsibility.

## Contributing

To report bugs or suggest improvements, please create an issue or pull request.

---

**Tip:** Start with the "Balanced" configuration and adjust according to your specific needs.

## 📜 License

![License: MIT (Non-Commercial)](https://img.shields.io/badge/license-MIT--NC-blue.svg)

This script is distributed under a modified MIT license (non-commercial use only).  
You are free to use, modify, and share it as long as it is **not for commercial purposes**.  
Please give credit if you reuse the project. ❤️  
Made by **SamK / Doctorchick**
