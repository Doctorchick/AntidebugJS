/**
 * AntidebugJS++ Server API
 * Centralized Protection Management System
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const speakeasy = require('speakeasy');
const crypto = require('crypto');

class AntidebugServer {
    constructor(config = {}) {
        this.app = express();
        this.config = {
            port: config.port || 3001,
            jwtSecret: config.jwtSecret || crypto.randomBytes(32).toString('hex'),
            adminPassword: config.adminPassword || 'admin123',
            enableRateLimit: config.enableRateLimit !== false,
            enableCors: config.enableCors !== false,
            ...config
        };
        
        this.detections = new Map(); // sessionId -> detections[]
        this.sessions = new Map(); // sessionId -> session data
        this.clients = new Map(); // clientId -> config
        this.bannedIPs = new Set();
        this.statistics = {
            totalDetections: 0,
            activeSessions: 0,
            bannedIPs: 0,
            topThreats: new Map()
        };
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.startCleanupTask();
    }

    setupMiddleware() {
        // Security headers
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"],
                }
            }
        }));
        
        // CORS
        if (this.config.enableCors) {
            this.app.use(cors({
                origin: this.config.allowedOrigins || true,
                credentials: true
            }));
        }
        
        // Rate limiting
        if (this.config.enableRateLimit) {
            const limiter = rateLimit({
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 1000, // limit each IP to 1000 requests per windowMs
                message: 'Too many requests from this IP'
            });
            this.app.use('/api/', limiter);
        }
        
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static('public'));
        
        // IP ban check middleware
        this.app.use((req, res, next) => {
            if (this.bannedIPs.has(req.ip)) {
                return res.status(403).json({ error: 'IP banned' });
            }
            next();
        });
    }

    setupRoutes() {
        // Authentication routes
        this.app.post('/api/auth/login', this.handleLogin.bind(this));
        this.app.post('/api/auth/verify-2fa', this.handleVerify2FA.bind(this));
        this.app.post('/api/auth/setup-2fa', this.authenticateToken, this.handleSetup2FA.bind(this));
        
        // Antidebug API routes
        this.app.post('/api/antidebug/report', this.handleDetectionReport.bind(this));
        this.app.get('/api/antidebug/config', this.handleGetConfig.bind(this));
        this.app.post('/api/antidebug/action', this.authenticateToken, this.handleTriggerAction.bind(this));
        
        // Admin dashboard routes
        this.app.get('/api/admin/dashboard', this.authenticateToken, this.handleGetDashboard.bind(this));
        this.app.get('/api/admin/detections', this.authenticateToken, this.handleGetDetections.bind(this));
        this.app.get('/api/admin/sessions', this.authenticateToken, this.handleGetSessions.bind(this));
        this.app.post('/api/admin/ban-ip', this.authenticateToken, this.handleBanIP.bind(this));
        this.app.delete('/api/admin/ban-ip', this.authenticateToken, this.handleUnbanIP.bind(this));
        this.app.put('/api/admin/client-config', this.authenticateToken, this.handleUpdateClientConfig.bind(this));
        this.app.get('/api/admin/statistics', this.authenticateToken, this.handleGetStatistics.bind(this));
        
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });
    }

    setupWebSocket() {
        const http = require('http');
        const WebSocket = require('ws');
        
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        
        this.wss.on('connection', (ws, req) => {
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleWebSocketMessage(ws, data);
                } catch (e) {
                    ws.send(JSON.stringify({ error: 'Invalid message format' }));
                }
            });
            
            ws.send(JSON.stringify({ type: 'connected', timestamp: Date.now() }));
        });
    }

    async handleLogin(req, res) {
        const { username, password } = req.body;
        
        if (username !== 'admin' || !bcrypt.compareSync(password, bcrypt.hashSync(this.config.adminPassword, 10))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { username, role: 'admin' },
            this.config.jwtSecret,
            { expiresIn: '1h' }
        );
        
        res.json({ token, requires2FA: true });
    }

    async handleVerify2FA(req, res) {
        const { token: userToken, code } = req.body;
        
        try {
            const decoded = jwt.verify(userToken, this.config.jwtSecret);
            
            // In production, verify against stored secret for user
            const secret = this.config.twoFactorSecret || speakeasy.generateSecret().base32;
            
            const verified = speakeasy.totp.verify({
                secret,
                encoding: 'base32',
                token: code,
                window: 1
            });
            
            if (verified) {
                const newToken = jwt.sign(
                    { ...decoded, verified2FA: true },
                    this.config.jwtSecret,
                    { expiresIn: '8h' }
                );
                
                res.json({ token: newToken, success: true });
            } else {
                res.status(401).json({ error: 'Invalid 2FA code' });
            }
        } catch (e) {
            res.status(401).json({ error: 'Invalid token' });
        }
    }

    async handleSetup2FA(req, res) {
        const secret = speakeasy.generateSecret({
            name: 'AntidebugJS++',
            length: 32
        });
        
        res.json({
            secret: secret.base32,
            qrCode: secret.otpauth_url
        });
    }

    async handleDetectionReport(req, res) {
        const report = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;
        
        // Validate report
        if (!report.sessionId || !report.type) {
            return res.status(400).json({ error: 'Invalid report format' });
        }
        
        // Store detection
        if (!this.detections.has(report.sessionId)) {
            this.detections.set(report.sessionId, []);
        }
        
        const detectionData = {
            ...report,
            ip: clientIP,
            serverTimestamp: Date.now()
        };
        
        this.detections.get(report.sessionId).push(detectionData);
        this.statistics.totalDetections++;
        
        // Update threat statistics
        const threat = report.type;
        this.statistics.topThreats.set(threat, 
            (this.statistics.topThreats.get(threat) || 0) + 1
        );
        
        // Determine response action
        const action = this.determineCounterMeasure(report, clientIP);
        
        // Broadcast to WebSocket clients (admin dashboard)
        this.broadcastToAdmins({
            type: 'detection',
            data: detectionData
        });
        
        res.json(action);
    }

    determineCounterMeasure(report, clientIP) {
        const sessionDetections = this.detections.get(report.sessionId) || [];
        const ipDetections = this.getIPDetections(clientIP);
        
        // Escalation levels based on detection count and severity
        const detectionCount = sessionDetections.length;
        const severeThreat = ['tampermonkey_detected', 'injection_detected', 'code_modified'].includes(report.type);
        
        if (detectionCount >= 10 || ipDetections.length >= 20) {
            this.bannedIPs.add(clientIP);
            this.statistics.bannedIPs++;
            return { action: 'session_kill', severity: 'high', reason: 'Multiple violations' };
        }
        
        if (severeThreat || detectionCount >= 5) {
            return { action: 'redirect_trap', severity: 'high', reason: 'Severe threat detected' };
        }
        
        if (detectionCount >= 3) {
            return { action: 'cpu_flood', severity: 'medium', reason: 'Repeated violations' };
        }
        
        if (report.type.includes('devtools') || report.type.includes('console')) {
            return { action: 'diversion', severity: 'low', reason: 'Development tools detected' };
        }
        
        return { action: 'freeze', severity: 'low', reason: 'Suspicious activity' };
    }

    getIPDetections(ip) {
        const allDetections = [];
        this.detections.forEach(sessionDetections => {
            sessionDetections.forEach(detection => {
                if (detection.ip === ip) {
                    allDetections.push(detection);
                }
            });
        });
        return allDetections;
    }

    async handleGetConfig(req, res) {
        const { clientId } = req.query;
        const defaultConfig = {
            aggressiveMode: false,
            stealthMode: true,
            enableWasm: true,
            mutationInterval: 30000,
            blockRightClick: false,
            checkInterval: 5000
        };
        
        const clientConfig = this.clients.get(clientId) || defaultConfig;
        res.json(clientConfig);
    }

    async handleTriggerAction(req, res) {
        const { sessionId, action } = req.body;
        
        // Send action to specific session via WebSocket
        this.broadcastToSession(sessionId, {
            type: 'action',
            action
        });
        
        res.json({ success: true });
    }

    async handleGetDashboard(req, res) {
        const dashboard = {
            statistics: this.getStatistics(),
            recentDetections: this.getRecentDetections(50),
            activeSessions: Array.from(this.sessions.values()),
            topThreats: Array.from(this.statistics.topThreats.entries())
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
        };
        
        res.json(dashboard);
    }

    async handleGetDetections(req, res) {
        const { limit = 100, offset = 0, sessionId, type } = req.query;
        let allDetections = [];
        
        this.detections.forEach((sessionDetections, sId) => {
            sessionDetections.forEach(detection => {
                if (!sessionId || sId === sessionId) {
                    if (!type || detection.type === type) {
                        allDetections.push({ sessionId: sId, ...detection });
                    }
                }
            });
        });
        
        allDetections.sort((a, b) => b.serverTimestamp - a.serverTimestamp);
        const paginatedDetections = allDetections.slice(offset, offset + parseInt(limit));
        
        res.json({
            detections: paginatedDetections,
            total: allDetections.length,
            hasMore: offset + parseInt(limit) < allDetections.length
        });
    }

    async handleGetSessions(req, res) {
        const sessions = Array.from(this.sessions.entries()).map(([sessionId, session]) => ({
            sessionId,
            ...session,
            detectionCount: (this.detections.get(sessionId) || []).length,
            lastActivity: Math.max(...(this.detections.get(sessionId) || []).map(d => d.serverTimestamp), session.createdAt)
        }));
        
        res.json(sessions);
    }

    async handleBanIP(req, res) {
        const { ip, reason } = req.body;
        
        if (!ip) {
            return res.status(400).json({ error: 'IP address required' });
        }
        
        this.bannedIPs.add(ip);
        this.statistics.bannedIPs++;
        
        this.broadcastToAdmins({
            type: 'ip_banned',
            data: { ip, reason, timestamp: Date.now() }
        });
        
        res.json({ success: true });
    }

    async handleUnbanIP(req, res) {
        const { ip } = req.body;
        
        if (this.bannedIPs.has(ip)) {
            this.bannedIPs.delete(ip);
            this.statistics.bannedIPs--;
        }
        
        res.json({ success: true });
    }

    async handleUpdateClientConfig(req, res) {
        const { clientId, config } = req.body;
        
        if (!clientId) {
            return res.status(400).json({ error: 'Client ID required' });
        }
        
        this.clients.set(clientId, { ...this.clients.get(clientId), ...config });
        
        this.broadcastToAdmins({
            type: 'config_updated',
            data: { clientId, config }
        });
        
        res.json({ success: true });
    }

    async handleGetStatistics(req, res) {
        res.json(this.getStatistics());
    }

    getStatistics() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        
        let recentDetections = 0;
        let dailyDetections = 0;
        const threatTypes = new Map();
        
        this.detections.forEach(sessionDetections => {
            sessionDetections.forEach(detection => {
                if (detection.serverTimestamp > oneHourAgo) {
                    recentDetections++;
                }
                if (detection.serverTimestamp > oneDayAgo) {
                    dailyDetections++;
                }
                
                threatTypes.set(detection.type, (threatTypes.get(detection.type) || 0) + 1);
            });
        });
        
        return {
            totalDetections: this.statistics.totalDetections,
            recentDetections, // Last hour
            dailyDetections, // Last 24 hours
            activeSessions: this.sessions.size,
            bannedIPs: this.bannedIPs.size,
            uniqueThreats: threatTypes.size,
            topThreats: Array.from(threatTypes.entries())
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
        };
    }

    getRecentDetections(limit = 50) {
        const allDetections = [];
        
        this.detections.forEach((sessionDetections, sessionId) => {
            sessionDetections.forEach(detection => {
                allDetections.push({ sessionId, ...detection });
            });
        });
        
        return allDetections
            .sort((a, b) => b.serverTimestamp - a.serverTimestamp)
            .slice(0, limit);
    }

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Token required' });
        }
        
        jwt.verify(token, this.config.jwtSecret, (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });
            
            if (!user.verified2FA) {
                return res.status(403).json({ error: '2FA verification required' });
            }
            
            req.user = user;
            next();
        });
    }

    broadcastToAdmins(message) {
        this.wss.clients.forEach(client => {
            if (client.readyState === client.OPEN && client.isAdmin) {
                client.send(JSON.stringify(message));
            }
        });
    }

    broadcastToSession(sessionId, message) {
        this.wss.clients.forEach(client => {
            if (client.readyState === client.OPEN && client.sessionId === sessionId) {
                client.send(JSON.stringify(message));
            }
        });
    }

    handleWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'authenticate':
                this.authenticateWebSocket(ws, data.token);
                break;
            case 'subscribe_session':
                ws.sessionId = data.sessionId;
                break;
            default:
                ws.send(JSON.stringify({ error: 'Unknown message type' }));
        }
    }

    authenticateWebSocket(ws, token) {
        try {
            const user = jwt.verify(token, this.config.jwtSecret);
            if (user.verified2FA) {
                ws.isAdmin = true;
                ws.send(JSON.stringify({ type: 'authenticated', success: true }));
            }
        } catch (e) {
            ws.send(JSON.stringify({ type: 'authentication_failed' }));
        }
    }

    startCleanupTask() {
        setInterval(() => {
            const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
            
            // Clean old detections
            this.detections.forEach((detections, sessionId) => {
                const recentDetections = detections.filter(d => d.serverTimestamp > cutoffTime);
                if (recentDetections.length === 0) {
                    this.detections.delete(sessionId);
                    this.sessions.delete(sessionId);
                } else {
                    this.detections.set(sessionId, recentDetections);
                }
            });
            
            console.log(`Cleanup completed. Active sessions: ${this.sessions.size}`);
        }, 60 * 60 * 1000); // Run every hour
    }

    start() {
        this.server.listen(this.config.port, () => {
            console.log(`🛡️  AntidebugJS++ Server running on port ${this.config.port}`);
            console.log(`📊 Admin Dashboard: http://localhost:${this.config.port}/admin`);
            console.log(`🔐 Default admin credentials: admin / ${this.config.adminPassword}`);
        });
    }
}

// Usage example
if (require.main === module) {
    const server = new AntidebugServer({
        port: process.env.PORT || 3001,
        adminPassword: process.env.ADMIN_PASSWORD || 'SecurePassword123!',
        jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
        allowedOrigins: ['http://localhost:3000', 'https://yourdomain.com']
    });
    
    server.start();
}

module.exports = AntidebugServer;