const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const P = require("pino");
const { makeWASocket, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");

require('events').EventEmitter.defaultMaxListeners = 500;

const PORT = process.env.PORT || 8000;

// ===== Middleware Setup =====
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== Serve main.html as Pair Page =====
app.use('/', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'lib/main.html'));
});

// ===== WhatsApp Auto Connection =====
async function connectToWhatsApp() {
    try {
        const { version } = await fetchLatestBaileysVersion();
        const sock = makeWASocket({
            printQRInTerminal: true,
            logger: P({ level: "silent" }),
            browser: ['BILAL-MD', 'Chrome', '1.0.0'],
        });

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                console.log('✅ WhatsApp Connected Successfully!');
            } else if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                if (reason === DisconnectReason.loggedOut) {
                    console.log('❌ Logged Out, reconnecting...');
                    connectToWhatsApp();
                } else {
                    console.log('♻️ Connection closed, retrying...');
                    connectToWhatsApp();
                }
            }
        });

        sock.ev.on('messages.upsert', async (m) => {
            const msg = m.messages[0];
            if (!msg.message) return;

            const from = msg.key.remoteJid;
            const body =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                msg.message.imageMessage?.caption ||
                "";

            if (body === ".alive") {
                await sock.sendMessage(from, { text: "👑 BILAL-MD MINI BOT ONLINE 👑" });
            }
        });

    } catch (err) {
        console.error("❌ WhatsApp Connection Error:", err);
        setTimeout(connectToWhatsApp, 5000);
    }
}

// ===== Start Server + Bot =====
app.listen(PORT, () => {
    console.log(`
👑 BILAL-MD MINI BOT 👑
Server running at: http://localhost:${PORT}
`);
    connectToWhatsApp(); // Bot start hote hi connect ho jaye
});

module.exports = app;
