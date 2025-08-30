# 🛡️ AntidebugJS++ v4.0.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-4.0.0-blue.svg)]()
[![Browser Support](https://img.shields.io/badge/Browser%20Support-Chrome%2C%20Firefox%2C%20Safari%2C%20Edge-green.svg)]()

AntidebugJS++ is an advanced, hybrid client-server anti-debugging solution designed to protect web applications from reverse engineering, debugging, and malicious script injection. It combines cutting-edge detection algorithms, offensive countermeasures, and real-time server management.

## 🚀 Features

### Client-Side Protection
- **Advanced DevTools Detection**: Multiple detection vectors including timing analysis, dimension checks, and console traps
- **Script Injection Detection**: Tampermonkey, Greasemonkey, browser extensions, and userscript detection
- **Headless Browser Detection**: Puppeteer, Selenium, PhantomJS, and other automation tool detection
- **Virtual Machine Detection**: Hardware fingerprinting and environment analysis
- **Code Integrity Monitoring**: Runtime code modification detection with self-healing capabilities
- **WebAssembly Protection**: Encrypted critical functions executed in WASM environment
- **Polymorphic Engine**: Continuously mutating code to prevent static analysis

### Server-Side Management
- **Real-Time Dashboard**: Web-based admin panel with live monitoring
- **Centralized Logging**: All detections logged with detailed analytics
- **Dynamic Configuration**: Real-time client configuration updates
- **IP Banning System**: Automatic and manual IP blacklisting
- **2FA Authentication**: Secure admin access with time-based OTP
- **RESTful API**: Complete API for integration and automation

### Offensive Countermeasures
- **Session Termination**: Immediate session invalidation and cleanup
- **Redirect Traps**: Decoy pages for detected attackers
- **CPU Flooding**: Resource exhaustion attacks against debuggers
- **Execution Freezing**: Strategic delays to disrupt analysis
- **Data Diversion**: Fake API responses and honeypot data
- **Self-Healing**: Automatic restoration of modified code

## Comparison with Competitors

| Feature | AntidebugJS++ | jscrambler | JSDefender | PackerJS |
|---------|---------------|------------|------------|----------|
| Real-time Detection | ✅ | ❌ | ❌ | ❌ |
| Server Dashboard | ✅ | ✅ | ❌ | ❌ |
| WebAssembly Integration | ✅ | ✅ | ❌ | ❌ |
| Polymorphic Engine | ✅ | ❌ | ❌ | ❌ |
| Open Source | ✅ | ❌ | ❌ | ✅ |
| Custom Countermeasures | ✅ | ✅ | ❌ | ❌ |
| Multi-detection Methods | ✅ | ✅ | ✅ | ❌ |

## 📦 Installation

### NPM Installation
```bash
npm install antidebugjs-plus
```

### CDN Usage
```html
<script src="https://cdn.jsdelivr.net/npm/antidebugjs-plus@2.0.0/dist/antidebug-plus.bundle.min.js"></script>
```

### Manual Installation
1. Download the latest release
2. Include the bundle in your project
3. Set up the server component

## 🔧 Quick Start

### Client-Side Implementation
```html
<!DOCTYPE html>
<html>
<head>
    <script src="antidebug-plus.bundle.js"></script>
    <script>
        // Basic setup
        const antidebug = new AntidebugJS({
            serverEndpoint: '/api/antidebug',
            clientId: 'my-web-app',
            aggressiveMode: true,
            stealthMode: false
        });
    </script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### Server-Side Setup
```javascript
const express = require('express');
const AntidebugServer = require('antidebugjs-plus/server');

const app = express();

// Initialize AntidebugJS++ server
const antidebugServer = new AntidebugServer({
    port: 3001,
    adminPassword: 'your-secure-password',
    jwtSecret: 'your-jwt-secret',
    enableRateLimit: true
});

// Serve admin dashboard
app.use('/admin', express.static('node_modules/antidebugjs-plus/admin'));

// Start server
antidebugServer.start();
```

## ⚙️ Configuration Options

### Client Configuration
```javascript
const antidebug = new AntidebugJS({
    // Server connection
    serverEndpoint: '/api/antidebug',        // API endpoint
    clientId: 'my-app',                      // Unique client identifier
    
    // Protection levels
    aggressiveMode: false,                   // Enable aggressive countermeasures
    stealthMode: true,                       // Hide console messages
    
    // Feature toggles
    enableWasm: true,                        // Use WebAssembly protection
    enableFingerprinting: true,              // Generate device fingerprints
    blockRightClick: false,                  // Block context menu
    blockKeyboardShortcuts: true,            // Block dev shortcuts
    
    // Timing configuration
    checkInterval: 5000,                     // Detection cycle interval (ms)
    mutationInterval: 30000,                 // Code mutation interval (ms)
    maxDetections: 10,                       // Max detections before lockdown
    
    // Callbacks
    onDetection: (detection) => {            // Custom detection handler
        console.log('Threat detected:', detection);
    },
    onCompromised: (info) => {               // System compromised handler
        console.log('System compromised:', info);
    },
    onError: (message, error) => {           // Error handler
        console.error('AntidebugJS++ error:', message, error);
    }
});
```

### Server Configuration
```javascript
const server = new AntidebugServer({
    // Server settings
    port: 3001,
    jwtSecret: 'your-256-bit-secret',
    adminPassword: 'secure-admin-password',
    twoFactorSecret: 'base32-2fa-secret',
    
    // Security settings
    enableRateLimit: true,
    enableCors: true,
    allowedOrigins: ['https://yourdomain.com'],
    
    // Behavior settings
    autoBlacklist: true,
    maxDetectionsPerIP: 50,
    sessionTimeout: 3600000
});
```

## 🔌 API Reference

### Client API

#### Core Methods
```javascript
// Initialize protection
antidebug.init();

// Stop protection
antidebug.stop();

// Get current status
const status = antidebug.getStatus();

// Get detection history
const history = antidebug.getDetectionHistory();

// Update configuration
antidebug.updateConfig({ aggressiveMode: true });

// Manual detection trigger
antidebug.triggerManualDetection('custom_threat', 'Details');
```

#### Static Utilities
```javascript
// Generate device fingerprint
const fingerprint = await AntidebugJS.generateFingerprint();

// Run specific detections
const devToolsResult = await AntidebugJS.detectDevTools();
const injectionResult = AntidebugJS.detectInjection();
const vmResult = AntidebugJS.detectVM();
const automationResult = AntidebugJS.detectAutomation();

// Quick start with defaults
const antidebug = AntidebugJS.quickStart();
```

### Server API

#### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify-2fa` - 2FA verification
- `POST /api/auth/setup-2fa` - Setup 2FA

#### Detection Endpoints
- `POST /api/antidebug/report` - Report detection (client)
- `GET /api/antidebug/config` - Get client configuration
- `POST /api/antidebug/action` - Trigger client action

#### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/detections` - Detection history
- `GET /api/admin/sessions` - Active sessions
- `POST /api/admin/ban-ip` - Ban IP address
- `DELETE /api/admin/ban-ip` - Unban IP address
- `PUT /api/admin/client-config` - Update client configuration
- `GET /api/admin/statistics` - Get statistics

## 🎯 Advanced Usage

### Express.js Middleware
```javascript
const express = require('express');
const { AntidebugJS } = require('antidebugjs-plus');

const app = express();

// Auto-inject AntidebugJS++ into HTML responses
app.use(AntidebugJS.middleware({
    aggressiveMode: true,
    clientId: 'express-app'
}));
```

### React Integration
```javascript
import { useEffect } from 'react';
import AntidebugJS from 'antidebugjs-plus';

function App() {
    useEffect(() => {
        const antidebug = new AntidebugJS({
            serverEndpoint: process.env.REACT_APP_ANTIDEBUG_ENDPOINT,
            clientId: 'react-app',
            onDetection: (detection) => {
                // Handle detection in React app
                console.warn('Security threat detected:', detection);
            }
        });

        return () => antidebug.stop();
    }, []);

    return <div>Your React App</div>;
}
```

### Vue.js Integration
```javascript
// plugins/antidebug.js
import AntidebugJS from 'antidebugjs-plus';

export default {
    install(Vue, options) {
        const antidebug = new AntidebugJS(options);
        
        Vue.prototype.$antidebug = antidebug;
        Vue.antidebug = antidebug;
    }
};

// main.js
import AntiDebugPlugin from './plugins/antidebug';

Vue.use(AntiDebugPlugin, {
    serverEndpoint: '/api/antidebug',
    clientId: 'vue-app'
});
```

### Custom Detection Rules
```javascript
const antidebug = new AntidebugJS({
    onDetection: (detection) => {
        // Custom logic based on detection type
        switch (detection.type) {
            case 'devtools_open':
                // Specific handling for DevTools
                break;
            case 'injection_detected':
                // Specific handling for script injection
                break;
            default:
                // Default handling
        }
    }
});

// Add custom detection
setInterval(() => {
    if (customThreatDetected()) {
        antidebug.triggerManualDetection('custom_threat', 'Custom threat details');
    }
}, 10000);
```

## 🔒 Security Best Practices

### Server Hardening
```javascript
const server = new AntidebugServer({
    // Use strong secrets
    jwtSecret: crypto.randomBytes(32).toString('hex'),
    adminPassword: generateSecurePassword(),
    
    // Enable all security features
    enableRateLimit: true,
    enableCors: true,
    allowedOrigins: ['https://yourdomain.com'], // Specific domains only
    
    // Set reasonable limits
    maxDetectionsPerIP: 20,
    sessionTimeout: 1800000 // 30 minutes
});
```

### Environment Variables
```bash
# .env file
ANTIDEBUG_JWT_SECRET=your-256-bit-jwt-secret
ANTIDEBUG_ADMIN_PASSWORD=your-secure-admin-password
ANTIDEBUG_2FA_SECRET=your-base32-2fa-secret
ANTIDEBUG_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
ANTIDEBUG_PORT=3001
```

### HTTPS Configuration
```javascript
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem')
};

const server = new AntidebugServer({ port: 3001 });
https.createServer(options, server.app).listen(3001);
```

## 📊 Monitoring and Analytics

### Dashboard Features
- **Real-time Detection Feed**: Live view of all security events
- **Threat Analytics**: Statistical analysis of attack patterns
- **Geographic Mapping**: Location-based threat visualization
- **Session Management**: Active session monitoring and control
- **Configuration Management**: Dynamic client configuration
- **IP Management**: Blacklist/whitelist administration

### Custom Metrics
```javascript
const antidebug = new AntidebugJS({
    onDetection: (detection) => {
        // Send to your analytics platform
        analytics.track('security_threat_detected', {
            type: detection.type,
            severity: getThreatSeverity(detection.type),
            timestamp: detection.timestamp,
            fingerprint: detection.fingerprint
        });
    }
});
```

## 🛠️ Development

### Building from Source
```bash
git clone https://github.com/Doctorchick/AntidebugJS.git
cd antidebugjs-plus
npm install
npm run build
```

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

### Development Mode
```bash
npm run dev             # Start development servers
npm run server:dev      # Server only
npm run client:dev      # Client only
```

## 🔧 Customization

### Custom Countermeasures
```javascript
class CustomAntidebug extends AntidebugJS {
    executeCountermeasure(action) {
        switch (action.action) {
            case 'custom_action':
                this.customCountermeasure();
                break;
            default:
                super.executeCountermeasure(action);
        }
    }
    
    customCountermeasure() {
        // Your custom countermeasure logic
        console.log('Custom countermeasure executed');
    }
}
```

### Custom Detection Algorithms
```javascript
const antidebug = new AntidebugJS({
    onDetection: (detection) => {
        // Add custom detection logic
        if (customDetectionLogic()) {
            antidebug.triggerManualDetection('custom_detection', 'Custom threat detected');
        }
    }
});

function customDetectionLogic() {
    // Your custom detection algorithm
    return suspiciousActivityDetected();
}
```

## ⚠️ Known Limitations

- **Browser Compatibility**: Requires ES6+ support
- **WASM Support**: Some older browsers may not support WebAssembly
- **Performance Impact**: Intensive protection may affect performance
- **False Positives**: Legitimate tools may trigger detections
- **Legal Considerations**: Ensure compliance with local laws

## 📝 Changelog

### v2.0.0
- Complete rewrite with hybrid architecture
- Server-side management dashboard
- Advanced detection algorithms
- WebAssembly protection module
- Polymorphic code engine
- Real-time configuration updates

### v1.5.0
- Added tampermonkey detection
- Improved console detection
- Performance optimizations
- Bug fixes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: [https://docs.antidebugjs-plus.com](https://docs.antidebugjs-plus.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/antidebugjs-plus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/antidebugjs-plus/discussions)
- **Email**: support@antidebugjs-plus.com

## ⭐ Star History

If this project helped you, please consider giving it a star on GitHub!

---

**⚠️ Disclaimer**: This tool is intended for legitimate security purposes only. Users are responsible for ensuring compliance with applicable laws and regulations. The authors are not responsible for any misuse of this software.
