const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { 
    makeWASocket, 
    DisconnectReason, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion, 
    delay 
} = require('@whiskeysockets/baileys');
const P = require('pino');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // serve main.html from lib/

// 🔹 Config path
const configPath = path.join(__dirname, '../route/config.js');

// 🔹 Helper: save data to config.js
function saveConfig(data) {
    const content = `module.exports = ${JSON.stringify(data, null, 4)};\n`;
    fs.writeFileSync(configPath, content, 'utf-8');
    console.log('⚙️ Config saved!');
}

// 🔹 Load config
let config = fs.existsSync(configPath) ? require(configPath) : {
    OWNER_NAME: "Owner",
    PREFIX: ".",
    AUTO_TYPING: false,
    AUTO_RECORDING: false,
    AUTO_VIEW_STATUS: false,
    AUTO_REACT_STATUS: false,
    ALWAYS_ONLINE: false
};

// 🔹 Serve main.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// 🔹 Receive vars from main.html
app.post('/update-config', (req, res) => {
    const newData = req.body;
    config = { ...config, ...newData }; // update current config
    saveConfig(config); // save to config.js
    res.json({ success: true, message: 'Config updated successfully!' });

    // 🔁 Restart bot automatically
    setTimeout(() => process.exit(0), 2000);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('🌐 Web server running...');
});

// 🔹 WhatsApp Bot
async function startBot() {
    try {
        const authFolder = path.join(__dirname, '../auth_info');
        if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(authFolder);
        const { version } = await fetchLatestBaileysVersion();
        console.log(`📱 Using WhatsApp v${version.join('.')}`);

        const conn = makeWASocket({
            version,
            printQRInTerminal: true,
            logger: P({ level: 'silent' }),
            auth: state,
            browser: ['BILAL-MD-MINI', 'Safari', '1.0.0']
        });

        conn.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                console.log(`❌ Disconnected: ${reason}`);
                if (reason !== DisconnectReason.loggedOut) startBot();
                else console.log('⚠️ Logged out. Delete auth_info folder.');
            } else if (connection === 'open') {
                console.log('✅ Bot connected successfully!');
            }
        });

        conn.ev.on('creds.update', saveCreds);

        // ✅ Commands
        conn.ev.on('messages.upsert', async (m) => {
            if (!m.messages) return;
            const msg = m.messages[0];
            const from = msg.key.remoteJid;
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
            if (!body) return;

            const prefix = config.PREFIX || '.';
            const owner = config.OWNER_NAME || 'Owner';

            if (body.startsWith(prefix)) {
                const cmd = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();

                if (cmd === 'alive') {
                    let text = `👑 Hello ${owner} 👑\nYour bot is online 🥰`;
                    await conn.sendMessage(from, { text }, { quoted: msg });
                }

                if (cmd === 'ping') {
                    let start = Date.now();
                    const sentMsg = await conn.sendMessage(from, { text: '🏓 Pinging...' }, { quoted: msg });
                    let latency = Date.now() - start;
                    await conn.sendMessage(from, { text: `🏓 Pong! ${latency}ms` }, { quoted: sentMsg });
                }
            }
        });

    } catch (err) {
        console.error("💥 Bot crashed, restarting...", err);
        setTimeout(startBot, 5000);
    }
}

startBot();
