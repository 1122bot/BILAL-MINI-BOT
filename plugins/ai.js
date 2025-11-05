const axios = require('axios');

// 🤖 AI / GPT Command — Mini Bot Version
module.exports = {
  command: 'ai',
  alias: ['gpt', 'ask', 'chatgpt', 'bing'],
  description: 'Chat with AI using your Heroku API',
  category: 'AI',
  react: '☺️',
  usage: '.ai <sawal>',
  
  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const q = args.join(" ");
    
    // 🤔 agar user ne question nahi diya
    if (!q) {
      return await socket.sendMessage(sender, {
        text: "*APKE PAS KOI SAWAL HAI 🤔 AUR APKO USKA JAWAB NAHI MIL RAHA 🥺*\n*TO ME APKE SAWAL KA JAWAB DHUND KAR DETA HU 😇*\n\n*ESE LIKHO ☺️👇*\n\n*GPT ❮APKA SAWAL❯*\n*AI ❮APKA SAWAL❯*\n\n*JAB AP ESE LIKHO GE TO APKE SAWAL KA JAWAB MIL JAYE GA 😍❤️*"
      }, { quoted: msg });
    }

    try {
      // ⏳ reaction: thinking mode
      await socket.sendMessage(sender, { react: { text: "🤔", key: msg.key } });

      // 💬 waiting message
      const waitMsg = await socket.sendMessage(sender, { 
        text: "*👑 BILAL-MD INTELLIGENCE 👑*"
      });

      // 🌍 API URL (tumhara heroku endpoint)
      const API_URL = "https://ai-api-key-699ac94e6fae.herokuapp.com/api/ask";

      // 📡 send user query
      const res = await axios.post(API_URL, { prompt: q });

      // 📩 agar reply mila
      if (res.data && res.data.reply) {
        await socket.sendMessage(sender, { 
          text: res.data.reply 
        }, { quoted: msg });
      } else {
        await socket.sendMessage(sender, { 
          text: "*APKE SAWAL KA JAWAB NAHI MILA 😔*"
        }, { quoted: msg });
      }

      // 🧹 waiting msg delete + success react
      await socket.sendMessage(sender, { react: { text: "😇", key: msg.key } });
      if (waitMsg?.key) await socket.sendMessage(sender, { delete: waitMsg.key });

    } catch (err) {
      console.error("❌ AI Command Error:", err);
      await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
      await socket.sendMessage(sender, { 
        text: "❌ *AI SERVER SE CONNECTION NHI HUA 😔*\n*THORA BAAD DUBARA TRY KARO 🥺*" 
      }, { quoted: msg });
    }
  }
};
