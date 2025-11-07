const gis = require("g-i-s");

module.exports = {
  command: "img",
  description: "Search and send 10 images directly",
  category: "media",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const query = args.join(" ");

      if (!query)
        return await sock.sendMessage(from, {
          text: `*AP NE KOI PHOTOS DOWNLOAD KARNI HAI 🥺* \n *TO AP ESE LIKHO ☺️* \\n\n *IMG ❮PHOTOS KA NAME❯* \n\n *TO APKI PHOTO DOWNLOAD KAR KE 😇 YAHA PER BHEJ DE JAYE GE 🥰❤️*`,
        }, { quoted: msg });

      gis(query, async (error, results) => {
        if (error || !results || results.length === 0)
          return await sock.sendMessage(from, {
            text: "❌ No images found.",
          }, { quoted: msg });

        const images = results.slice(0, 10).map(r => r.url);

        for (let i = 0; i < images.length; i++) {
          try {
            await sock.sendMessage(from, {
              image: { url: images[i] },
              caption: `*👑 BILAL-MD MINI BOT 👑*`,
            }, { quoted: msg });

            await new Promise(r => setTimeout(r, 800)); // thoda delay
          } catch (err) {
            console.log("Image send error:", err.message);
          }
        }
      });
    } catch (err) {
      console.error("Command error:", err);
    }
  },
};
