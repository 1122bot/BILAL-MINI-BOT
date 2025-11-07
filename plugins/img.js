const gis = require("g-i-s");

module.exports = {
  command: "img",
  desc: "🔍 Google se 10 random images bhejta hai",
  react: "📸",
  category: "media",

  async execute(sock, msg, args) {
    try {
      const from = msg.key.remoteJid;
      const query = args.join(" ");
      const pushname = msg.pushName || "User";

      if (!query) {
        return await sock.sendMessage(from, {
          text: `❌ *Kya search karna hai bhai?*\n\n📌 Example:\n.img car`
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { text: `🔍 Searching *${query}* images...` }, { quoted: msg });

      gis(query, async (error, results) => {
        if (error || !results || results.length === 0) {
          return await sock.sendMessage(from, {
            text: "❌ Koi image nahi mili, try another keyword!"
          }, { quoted: msg });
        }

        // Random 10 results
        const images = results.sort(() => 0.5 - Math.random()).slice(0, 10);

        await sock.sendMessage(from, { text: `📸 *${images.length} Images mil gayi!*\n> Requested by: ${pushname}` }, { quoted: msg });

        for (let i = 0; i < images.length; i++) {
          await sock.sendMessage(from, {
            image: { url: images[i].url },
            caption: `🖼️ *${query}* - Image ${i + 1}\n> MINI BILAL MD`
          }, { quoted: msg });

          // small delay to avoid rate limit
          await new Promise(res => setTimeout(res, 1000));
        }
      });
    } catch (e) {
      console.error(e);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ Error: ${e.message}`
      }, { quoted: msg });
    }
  }
};
