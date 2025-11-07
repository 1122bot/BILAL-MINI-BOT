// 🌟 Code by bilal
const axios = require("axios");

module.exports = {
  name: "tiktok",
  alias: ["tt", "tiktokdl"],
  desc: "Download TikTok video",
  category: "downloader",
  react: "🎬",

  async execute(client, m, args, text, { from, reply }) {
    try {
      if (!args[0]) return reply("🎵 *Please provide a TikTok video link!*");

      const url = args[0];
      const api = `https://www.varshade.biz.id/api/downloader/tiktok?url=${url}`;
      const res = await axios.get(api);

      if (!res.data || !res.data.result || !res.data.result.video) {
        return reply("❌ *Video not found or API issue!*");
      }

      const videoUrl = res.data.result.video;

      await client.sendMessage(
        from,
        { video: { url: videoUrl }, caption: "🎬 *Here’s your TikTok video!*" },
        { quoted: m }
      );
    } catch (err) {
      console.error(err);
      reply("❌ *Error downloading video!*");
    }
  },
};
