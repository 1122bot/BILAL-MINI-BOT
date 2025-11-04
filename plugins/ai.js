// 🌟 Code by BILAL
const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["gpt", "ask", "chatgpt", "bing"],
    desc: "Chat with AI using OpenAI API (via Heroku)",
    category: "AI",
    react: "☺️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    // 🤖 har message pe react
    await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

    // 😇 agar user ne sawal nahi likha
    if (!q) {
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });
        return reply(
`*APKE PAS KOI SAWAL HAI 🤔 AUR APKO USKA JAWAB NAHI MIL RAHA 🥺*  
*TO KYA ME APKE SAWAL KA JAWAB DHUND KAR DU 😇*  

*TO AP ESE LIKHO ☺️👇*  

*GPT ❮APKA SAWAL❯*  
*AI ❮APKA SAWAL❯*  

*JAB AP ESE LIKHO GE TO APKE SAWAL KA JAWAB MIL JAYE GA 😍❤️*`
        );
    }

    try {
        // 💬 show thinking message
        await reply("*👑 BILAL-MD INTELLIGENCE SOCH RAHA HAI... 🧠*");

        // 🔗 your Heroku AI endpoint
        const API_URL = "https://ai-api-key-699ac94e6fae.herokuapp.com/api/ask";

        // 🚀 send prompt to API
        const res = await axios.post(API_URL, { prompt: q });

        // 🧩 check and send result
        if (res.data && res.data.reply) {
            await conn.sendMessage(from, { react: { text: "😍", key: m.key } });
            return reply(res.data.reply);
        } else {
            await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
            return reply("*APKE SAWAL KA JAWAB NAHI MILA 😔*");
        }

    } catch (err) {
        console.error("❌ AI ERROR:", err);
        await conn.sendMessage(from, { react: { text: "😢", key: m.key } });
        reply("❌ *AI SERVER SE CONNECTION ME ERROR HAI 🥺*\n*Thodi der baad dubara try karo ❤️*");
    }
});
