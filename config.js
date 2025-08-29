const AntidebugConfig = {
  LEVELS: {
    STEALTH: {
      name: 'Stealth',
      checkInterval: 5000,
      enableConsoleSpam: false,
      enableRedirection: false,
      enableDataCorruption: true,
      enablePerformanceDegradation: true,
      enableFakeData: true,
      debuggerTolerance: 3,
      reactionDelay: 2000,
      enableWebAssembly: false,
      enablePolymorphism: true,
      obfuscationLevel: 'medium'
    },
    BALANCED: {
      name: 'Balanced',
      checkInterval: 2000,
      enableConsoleSpam: true,
      enableRedirection: true,
      enableDataCorruption: true,
      enablePerformanceDegradation: true,
      enableFakeData: true,
      debuggerTolerance: 2,
      reactionDelay: 1000,
      enableWebAssembly: true,
      enablePolymorphism: true,
      obfuscationLevel: 'high'
    },
    ULTRA: {
      name: 'Ultra',
      checkInterval: 500,
      enableConsoleSpam: true,
      enableRedirection: true,
      enableDataCorruption: true,
      enablePerformanceDegradation: true,
      enableFakeData: true,
      debuggerTolerance: 1,
      reactionDelay: 100,
      enableWebAssembly: true,
      enablePolymorphism: true,
      obfuscationLevel: 'extreme'
    }
  },
  
  MESSAGES: {
    redirectUrl: 'https://www.google.com',
    consoleWarning: 'Debugging is not allowed on this website.',
    fakeError: 'TypeError: Cannot read property of undefined'
  },
  
  DETECTION_METHODS: {
    devtools: true,
    debugger: true,
    console: true,
    performance: true,
    windowSize: true,
    userAgent: true,
    extensions: true,
    vm: true,
    sourcemap: true,
    scope: true
  }
};