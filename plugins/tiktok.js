const { ttdl } = require("ruhend-scraper");
const axios = require("axios");

// Prevent duplicate processing
const processedMessages = new Set();

module.exports = {
  command: "tiktok",
  alias: ["tt", "ttdl"],
  desc: "Download TikTok videos (HD/SD) with audio if available",
  react: "🔄",
  category: "download",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

      // Prevent duplicate processing
      if (processedMessages.has(msg.key.id)) return;
      processedMessages.add(msg.key.id);
      setTimeout(() => processedMessages.delete(msg.key.id), 5 * 60 * 1000); // 5 min cleanup

      const url = args[0] || text?.split(" ").slice(1).join(" ").trim();
      if (!url) return sock.sendMessage(from, { text: "❌ Please provide a TikTok link.\n\nExample: *.tiktok <link>*" }, { quoted: msg });
      if (!url.includes("tiktok.com")) return sock.sendMessage(from, { text: "❌ Invalid TikTok link!" }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: "🔄", key: msg.key } });

      const apis = [
        `https://api.princetechn.com/api/download/tiktok?apikey=prince&url=${encodeURIComponent(url)}`,
        `https://api.princetechn.com/api/download/tiktokdlv2?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(url)}`,
        `https://api.princetechn.com/api/download/tiktokdlv3?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(url)}`,
        `https://api.princetechn.com/api/download/tiktokdlv4?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(url)}`,
        `https://api.dreaded.site/api/tiktok?url=${encodeURIComponent(url)}`
      ];

      let videoUrl = null;
      let audioUrl = null;
      let title = null;

      // Try all APIs
      for (const apiUrl of apis) {
        try {
          const res = await axios.get(apiUrl, { timeout: 10000 });
          const data = res.data;

          if (data?.result?.videoUrl) {
            videoUrl = data.result.videoUrl;
            audioUrl = data.result.audioUrl;
            title = data.result.title;
            break;
          } else if (data?.tiktok?.video) {
            videoUrl = data.tiktok.video;
            break;
          } else if (data?.video) {
            videoUrl = data.video;
            break;
          }
        } catch (err) {
          console.error("TikTok API failed:", err.message);
          continue;
        }
      }

      // Fallback to ttdl
      if (!videoUrl) {
        const downloadData = await ttdl(url);
        if (downloadData?.data?.length > 0) {
          const media = downloadData.data[0];
          videoUrl = media.url;
          title = media.title || "TikTok Video";
        }
      }

      if (!videoUrl) return sock.sendMessage(from, { text: "❌ Failed to download TikTok video. Try another link." }, { quoted: msg });

      // Send video
      await sock.sendMessage(from, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: title ? `🎬 ${title}\n🔰 Powered by Mini-MD` : "🔰 TikTok Video"
      }, { quoted: msg });

      // Send audio if available
      if (audioUrl) {
        try {
          await sock.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mp3",
            caption: "🎵 Audio from TikTok"
          }, { quoted: msg });
        } catch (err) {
          console.error("Audio send failed:", err.message);
        }
      }

    } catch (err) {
      console.error("TikTok command error:", err.message);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Error: ${err.message}` }, { quoted: msg });
    }
  }
};
