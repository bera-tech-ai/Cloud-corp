const { 
    giftedId,
    removeFile
} = require('../gift');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
let router = express.Router();
const pino = require("pino");

// Gifted Baileys imports
const {
    default: giftedConnect,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    fetchLatestWaWebVersion,
    Browsers
} = require("gifted-baileys");

// Import config
const config = require('./../config');

const sessionDir = path.join(__dirname, "..", "session");

// Store active QR sessions
const activeQRSessions = new Map();

router.get('/', async (req, res) => {
    const id = giftedId();
    let responseSent = false;
    let qrGenerated = false;

    async function cleanUpSession() {
        try {
            await removeFile(path.join(sessionDir, id));
            activeQRSessions.delete(id);
            console.log(`🧹 Cleaned up QR session: ${id}`);
        } catch (cleanupError) {
            console.error("QR Cleanup error:", cleanupError);
        }
    }

    async function GIFTED_QR_CODE() {
        try {
            const { version } = await fetchLatestWaWebVersion();
            
            const { state, saveCreds } = await useMultiFileAuthState(path.join(sessionDir, id));
            
            let Gifted = giftedConnect({
                version,
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.macOS("Desktop"),
                connectTimeoutMs: 60000,
                keepAliveIntervalMs: 30000
            });

            // Store session
            activeQRSessions.set(id, {
                socket: Gifted,
                startTime: new Date(),
                connected: false
            });

            Gifted.ev.on('creds.update', saveCreds);
            
            Gifted.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                
                // Show QR code
                if (qr && !qrGenerated) {
                    qrGenerated = true;
                    const qrImage = await QRCode.toDataURL(qr);
                    
                    if (!responseSent && !res.headersSent) {
                        res.send(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>GIFTED-MD | QR CODE</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                    * {
                                        margin: 0;
                                        padding: 0;
                                        box-sizing: border-box;
                                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                    }
                                    
                                    body {
                                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                        min-height: 100vh;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        padding: 20px;
                                    }
                                    
                                    .container {
                                        background: rgba(255, 255, 255, 0.95);
                                        border-radius: 20px;
                                        padding: 40px;
                                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                                        text-align: center;
                                        max-width: 500px;
                                        width: 100%;
                                        backdrop-filter: blur(10px);
                                    }
                                    
                                    h1 {
                                        color: #333;
                                        margin-bottom: 10px;
                                        font-size: 28px;
                                        font-weight: 800;
                                        background: linear-gradient(45deg, #667eea, #764ba2);
                                        -webkit-background-clip: text;
                                        -webkit-text-fill-color: transparent;
                                    }
                                    
                                    .subtitle {
                                        color: #666;
                                        margin-bottom: 30px;
                                        font-size: 16px;
                                    }
                                    
                                    .qr-container {
                                        position: relative;
                                        margin: 30px auto;
                                        width: 300px;
                                        height: 300px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    }
                                    
                                    .qr-code {
                                        width: 100%;
                                        height: 100%;
                                        padding: 15px;
                                        background: white;
                                        border-radius: 15px;
                                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                                        border: 3px solid #f0f0f0;
                                    }
                                    
                                    .qr-code img {
                                        width: 100%;
                                        height: 100%;
                                        border-radius: 10px;
                                    }
                                    
                                    .instructions {
                                        background: #f8f9fa;
                                        border-radius: 10px;
                                        padding: 20px;
                                        margin-top: 30px;
                                        text-align: left;
                                    }
                                    
                                    .instructions h3 {
                                        color: #333;
                                        margin-bottom: 10px;
                                        font-size: 18px;
                                    }
                                    
                                    .instructions ol {
                                        padding-left: 20px;
                                        color: #555;
                                        line-height: 1.8;
                                    }
                                    
                                    .pulse {
                                        animation: pulse 2s infinite;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        right: 0;
                                        bottom: 0;
                                        border-radius: 15px;
                                    }
                                    
                                    @keyframes pulse {
                                        0% {
                                            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
                                        }
                                        70% {
                                            box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
                                        }
                                        100% {
                                            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
                                        }
                                    }
                                    
                                    .status {
                                        margin-top: 20px;
                                        padding: 10px;
                                        border-radius: 10px;
                                        background: #e8f4fd;
                                        color: #007bff;
                                        font-weight: 600;
                                    }
                                    
                                    .back-btn {
                                        display: inline-block;
                                        margin-top: 25px;
                                        padding: 12px 30px;
                                        background: linear-gradient(45deg, #667eea, #764ba2);
                                        color: white;
                                        text-decoration: none;
                                        border-radius: 50px;
                                        font-weight: 600;
                                        transition: all 0.3s ease;
                                        border: none;
                                        cursor: pointer;
                                        font-size: 16px;
                                    }
                                    
                                    .back-btn:hover {
                                        transform: translateY(-3px);
                                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                                    }
                                    
                                    @media (max-width: 480px) {
                                        .container {
                                            padding: 25px;
                                        }
                                        
                                        .qr-container {
                                            width: 250px;
                                            height: 250px;
                                        }
                                        
                                        h1 {
                                            font-size: 24px;
                                        }
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h1>GIFTED-MD QR CODE</h1>
                                    <p class="subtitle">Scan to connect your WhatsApp account</p>
                                    
                                    <div class="qr-container">
                                        <div class="qr-code pulse">
                                            <img src="${qrImage}" alt="QR Code"/>
                                        </div>
                                    </div>
                                    
                                    <div class="status" id="status">
                                        ⏳ Waiting for scan...
                                    </div>
                                    
                                    <div class="instructions">
                                        <h3>📱 How to connect:</h3>
                                        <ol>
                                            <li>Open WhatsApp on your phone</li>
                                            <li>Tap <strong>Settings</strong> → <strong>Linked Devices</strong></li>
                                            <li>Tap <strong>Link a Device</strong></li>
                                            <li>Point your camera at the QR code</li>
                                            <li>Bot will automatically start after connection</li>
                                        </ol>
                                    </div>
                                    
                                    <a href="/" class="back-btn">← Back to Home</a>
                                </div>
                                
                                <script>
                                    const statusEl = document.getElementById('status');
                                    let checkCount = 0;
                                    
                                    // Simulate connection check
                                    function checkConnection() {
                                        checkCount++;
                                        if (checkCount === 3) {
                                            statusEl.innerHTML = '✅ QR Code Generated - Ready to Scan';
                                            statusEl.style.background = '#d4edda';
                                            statusEl.style.color = '#155724';
                                        }
                                    }
                                    
                                    // Check every 2 seconds
                                    setInterval(checkConnection, 2000);
                                    
                                    // Initial check
                                    setTimeout(checkConnection, 1000);
                                </script>
                            </body>
                            </html>
                        `);
                        responseSent = true;
                    }
                }

                // Handle successful connection
                if (connection === "open") {
                    const session = activeQRSessions.get(id);
                    if (session) {
                        session.connected = true;
                        console.log(`✅ QR Session Connected: ${id}`);
                        
                        // Send welcome message
                        try {
                            await Gifted.sendMessage(Gifted.user.id, {
                                text: `*✨ GIFTED-MD BOT ACTIVATED ✨*\n\n` +
                                      `✅ **QR Connection Successful!**\n` +
                                      `⚡ Version: ${config.VERSION}\n` +
                                      `👑 Owner: ${config.OWNER_NAME}\n\n` +
                                      `🔧 Bot is now running automatically\n` +
                                      `💬 Commands: Type ${config.PREFIX}menu\n\n` +
                                      `> ${config.FOOTER}`
                            });
                            
                            // Bot is now running - don't close connection!
                            // It will stay active and handle commands
                            
                        } catch (error) {
                            console.error("Welcome message error:", error);
                        }
                    }
                }
                
                // Handle disconnection
                if (connection === "close") {
                    console.log(`🔌 QR Session Disconnected: ${id}`);
                    await cleanUpSession();
                    
                    if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                        // Auto-reconnect for QR sessions
                        setTimeout(() => {
                            console.log(`🔄 Recreating QR for session: ${id}`);
                            GIFTED_QR_CODE();
                        }, 5000);
                    }
                }
            });

        } catch (err) {
            console.error("QR generation error:", err);
            if (!responseSent) {
                res.status(500).json({ 
                    success: false,
                    code: "QR_GENERATION_FAILED",
                    message: "Failed to generate QR code"
                });
                responseSent = true;
            }
            await cleanUpSession();
        }
    }

    try {
        await GIFTED_QR_CODE();
    } catch (finalError) {
        console.error("Final QR error:", finalError);
        if (!responseSent) {
            res.status(500).json({ 
                success: false,
                message: "QR service error"
            });
        }
    }
});

// QR sessions status
router.get('/status', (req, res) => {
    const sessions = [];
    for (const [id, session] of activeQRSessions) {
        sessions.push({
            id,
            connected: session.connected,
            uptime: Math.floor((Date.now() - session.startTime) / 1000) + "s"
        });
    }
    
    res.json({
        success: true,
        active_qr_sessions: sessions.length,
        sessions: sessions
    });
});

module.exports = router;