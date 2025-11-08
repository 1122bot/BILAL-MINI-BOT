const { 
    default: makeWASocket, 
    DisconnectReason, 
    useSingleFileAuthState, 
    fetchLatestBaileysVersion, 
    delay 
} = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const config = require('../config');

// SINGLE import
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    console.log(`Using WA v${version.join('.')}`);

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
            console.log(`Connection closed: ${reason}`);
            if (reason !== DisconnectReason.loggedOut) startBot();
            else console.log('Logged out. Delete auth_info.json and re-run.');
        } else if (connection === 'open') {
            console.log('✅ Bot connected successfully!');
        }
    });

    conn.ev.on('creds.update', saveState);

    // AUTO FEATURES
    conn.ev.on('messages.upsert', async (m) => {
        if (!m.messages) return;
        for (let msg of m.messages) {
            if (!msg.key.fromMe && msg.key.remoteJid) {
                const jid = msg.key.remoteJid;

                if (config.AUTO_TYPING) {
                    await conn.sendPresenceUpdate('composing', jid);
                    await delay(3000);
                    await conn.sendPresenceUpdate('paused', jid);
                }

                if (config.AUTO_RECORDING) {
                    await conn.sendPresenceUpdate('recording', jid);
                    await delay(3000);
                    await conn.sendPresenceUpdate('paused', jid);
                }

                if (config.AUTO_VIEW_STATUS) {
                    try { await conn.readMessages([msg.key]); } catch(e) {}
                }

                if (config.AUTO_REACT_STATUS) {
                    const reacts = ['🥰','❤️','😍','😇','🥳','🌹','💖','💗','💘','💜','💕','💞','♥️','❣️','💌'];
                    const randomReact = reacts[Math.floor(Math.random() * reacts.length)];
                    try { await conn.sendMessage(jid, { react: { text: randomReact, key: msg.key } }); } 
                    catch(e) {}
                }
            }
        }
    });

    if (config.ALWAYS_ONLINE) console.log('🤖 ALWAYS ONLINE ENABLED');

    // SIMPLE COMMANDS
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

    return conn;
}

startBot().catch(err => console.error(err));
