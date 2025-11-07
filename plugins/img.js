const gis = require("g-i-s");

module.exports = {
  command: "img",
  description: "Search and send 10 unique random images",
  category: "media",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const query = args.join(" ");

      if (!query) {
        return await sock.sendMessage(from, {
          text: `*📸 PHOTO DOWNLOAD KARNE K LIYE:* \n\n👉 *IMG <PHOTO NAME>* likho, jaise:\n\n*IMG cat*\n\nAur mai 10 alag alag photos bhej dunga 😍`,
        }, { quoted: msg });
      }

      gis(query, async (error, results) => {
        if (error || !results || results.length === 0) {
          return await sock.sendMessage(from, { text: "❌ No images found." }, { quoted: msg });
        }

        // ✅ Remove duplicates
        const uniqueUrls = [...new Set(results.map(r => r.url))];

        // ✅ Shuffle randomly
        const shuffled = uniqueUrls.sort(() => Math.random() - 0.5);

        // ✅ Take only first 10 unique random images
        const selected = shuffled.slice(0, 10);

        // ✅ Send images one by one
        for (let i = 0; i < selected.length; i++) {
          try {
            await sock.sendMessage(from, {
              image: { url: selected[i] },
            }, { quoted: msg });

            await new Promise(r => setTimeout(r, 700)); // thoda delay for smooth send
          } catch (err) {
            console.log("❌ Image send error:", err.message);
          }
        }
      });
    } catch (err) {
      console.error("❌ Command error:", err);
    }
  },
};
