// 🟢 Prevent Heroku from crashing (keep port alive)
const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("✅ BILAL-MD Bot is running fine!"));
app.listen(process.env.PORT || 3000);

const {
    makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");
const path = require("path");
const config = require("../config");

async function startBot() {
    try {
        // ✅ AUTH FOLDER AUTO CREATE
        const authFolder = path.join(__dirname, "../auth_info");
        if (!fs.existsSync(authFolder)) {
            fs.mkdirSync(authFolder, { recursive: true });
            console.log("📁 auth_info folder created automatically");
        }

        // ✅ MULTI FILE AUTH SYSTEM
        const { state, saveCreds } = await useMultiFileAuthState(authFolder);

        // ✅ FETCH LATEST WHATSAPP VERSION
        const { version } = await fetchLatestBaileysVersion();
        console.log(`📱 Using WhatsApp v${version.join(".")}`);

        // ✅ CREATE SOCKET
        const conn = makeWASocket({
            version,
            printQRInTerminal: true,
            logger: P({ level: "silent" }),
            auth: state,
            browser: ["BILAL-MD-MINI", "Safari", "1.0.0"],
        });

        // ✅ CONNECTION HANDLER
        conn.ev.on("connection.update", (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "close") {
                const reason = lastDisconnect?.error?.output?.statusCode;
                console.log(`❌ Connection closed: ${reason}`);
                if (reason !== DisconnectReason.loggedOut) {
                    console.log("🔄 Restarting bot automatically...");
                    setTimeout(startBot, 3000); // safe auto-restart delay
                } else {
                    console.log("⚠️ Logged out. Delete auth_info folder and re-run.");
                }
            } else if (connection === "open") {
                console.log("✅ Bot connected successfully!");
            }
        });

        conn.ev.on("creds.update", saveCreds);

        // ✅ AUTO FEATURES
        conn.ev.on("messages.upsert", async (m) => {
            if (!m.messages) return;
            for (let msg of m.messages) {
                if (!msg.key.fromMe && msg.key.remoteJid) {
                    const jid = msg.key.remoteJid;

                    if (config.AUTO_TYPING) {
                        await conn.sendPresenceUpdate("composing", jid);
                        await delay(3000);
                        await conn.sendPresenceUpdate("paused", jid);
                    }

                    if (config.AUTO_RECORDING) {
                        await conn.sendPresenceUpdate("recording", jid);
                        await delay(3000);
                        await conn.sendPresenceUpdate("paused", jid);
                    }

                    if (config.AUTO_VIEW_STATUS) {
                        try { await conn.readMessages([msg.key]); } catch (e) {}
                    }

                    if (config.AUTO_REACT_STATUS) {
                        const reacts = ["🥰","❤️","😍","😇","🥳","🌹","💖","💗","💘","💜","💕","💞","♥️","❣️","💌"];
                        const randomReact = reacts[Math.floor(Math.random() * reacts.length)];
                        try {
                            await conn.sendMessage(jid, { react: { text: randomReact, key: msg.key } });
                        } catch (e) {}
                    }
                }
            }
        });

        if (config.ALWAYS_ONLINE) console.log("🤖 ALWAYS ONLINE ENABLED");

        // ✅ SIMPLE COMMANDS
        conn.ev.on("messages.upsert", async (m) => {
            if (!m.messages) return;
            const msg = m.messages[0];
            const from = msg.key.remoteJid;
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
            if (!body) return;

            const prefix = config.PREFIX || ".";
            const owner = config.OWNER_NAME || "Owner";

            if (body.startsWith(prefix)) {
                const cmd = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();

                if (cmd === "alive") {
                    let text = `👑 Hello ${owner} 👑\nYour bot is online 🥰`;
                    await conn.sendMessage(from, { text }, { quoted: msg });
                }

                if (cmd === "ping") {
                    let start = Date.now();
                    const sentMsg = await conn.sendMessage(from, { text: "🏓 Pinging..." }, { quoted: msg });
                    let latency = Date.now() - start;
                    await conn.sendMessage(from, { text: `🏓 Pong! ${latency}ms` }, { quoted: sentMsg });
                }
            }
        });

        return conn;
    } catch (err) {
        console.error("💥 Bot crashed, restarting in 5s...", err);
        setTimeout(startBot, 5000);
    }
}

startBot();
