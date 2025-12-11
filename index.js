const express = require('express');
const path = require('path');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 50900;
const { 
  qrRoute,
  pairRoute
} = require('./routes');
require('events').EventEmitter.defaultMaxListeners = 2000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/qr', qrRoute);
app.use('/code', pairRoute);

// Web Pages
app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pair.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 200,
        success: true,
        service: 'Gifted-Md Session Generator',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            pairing: '/code?number=YOUR_NUMBER',
            qr: '/qr',
            status: '/health'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        success: false,
        message: 'Route not found',
        available_routes: ['/', '/pair', '/qr', '/code', '/health']
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        status: 500,
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║   🚀 Gifted Session Generator Started!   ║
╠══════════════════════════════════════════╣
║ 🔗 Local:  http://localhost:${PORT}          ║
║ 🌐 Public: Check your deployment URL      ║
║ 📱 Mode:   Multi-Session Generation       ║
║ ⚡ Version: 2.0.0 - Gifted Baileys        ║
╚══════════════════════════════════════════╝

📊 Endpoints:
   • /          - Home Page
   • /pair      - Pairing Interface
   • /qr        - QR Code Generator
   • /code      - Pairing Code API
   • /health    - Health Check

🔧 Using Gifted Baileys for WhatsApp connection
💾 Sessions saved temporarily and auto-cleaned
📦 Ready for Heroku/Railway deployment
`);
});

module.exports = app;
