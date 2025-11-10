const config = require("../config");

if (!global.antiLinkStatus) global.antiLinkStatus = {};
if (!global.warnings) global.warnings = {};

module.exports = {
  command: "antilink",
  alias: ["alink"],
  description: "Enable or disable anti-link protection in group",
  category: "group",

  execute: async (conn, m, args) => {
    try {
      const from = m.key.remoteJid;
      const sender = m.key.participant || from;
      const isGroup = m.isGroup || false;
      const isAdmins = m.isAdmins || false;
      const reply = (text) => conn.sendMessage(from, { text }, { quoted: m });

      if (!isGroup) return reply("❌ YE COMMAND SIRF GROUP ME USE HOGA ☺️");
      if (!isAdmins) return reply("❌ YE COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI 😇");

      const action = args[0]?.toLowerCase();
      if (!action || (action !== "on" && action !== "off")) {
        return reply(`*👑 ANTI LINK COMMAND 👑*\n\nStatus: ${global.antiLinkStatus[from] ? "ON" : "OFF"}\n\nUse:\n• ANTILINK ON - Activate\n• ANTILINK OFF - Deactivate`);
      }

      if (action === "on") {
        global.antiLinkStatus[from] = true;
        return reply("*✅ ANTILINK ON*\nGroup me links bhejna ab block hoga. 3 warnings ke baad member remove ho jayega.");
      } else {
        global.antiLinkStatus[from] = false;
        return reply("*✅ ANTILINK OFF*\nAb group me links bhejna allowed hai.");
      }

    } catch (error) {
      console.error("Anti-link command error:", error);
      return conn.sendMessage(m.key.remoteJid, { text: "❌ Koi error hua, dubara try karein!" }, { quoted: m });
    }
  },

  onMessage: async (conn, m) => {
    try {
      const from = m.key.remoteJid;
      const sender = m.key.participant || from;
      const isGroup = m.isGroup || false;

      if (!isGroup || !global.antiLinkStatus[from]) return;

      const body = m.message?.conversation || "";
      if (!body) return;

      const linkPatterns = [
        /https?:\/\/chat\.whatsapp\.com\/\S+/gi,
        /https?:\/\/wa\.me\/\S+/gi,
        /https?:\/\/t\.me\/\S+/gi,
        /https?:\/\/telegram\.me\/\S+/gi,
        /https?:\/\/www\.youtube\.com\/\S+/gi,
        /https?:\/\/youtu\.be\/\S+/gi,
        /https?:\/\/www\.facebook\.com\/\S+/gi,
        /https?:\/\/www\.tiktok\.com\/\S+/gi,
        /https?:\/\/www\.snapchat\.com\/\S+/gi,
        /https?:\/\/www\.instagram\.com\/\S+/gi,
        /https?:\/\/www\.vidmate\.com\/\S+/gi,
        /https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}\/\S+/gi, // generic https:// or www.
        /www\.\S+/gi
      ];

      const containsLink = linkPatterns.some(p => p.test(body));
      if (!containsLink) return;

      // Delete message
      await conn.sendMessage(from, { delete: m.key });
      global.warnings[sender] = (global.warnings[sender] || 0) + 1;
      const count = global.warnings[sender];

      if (count < 4) {
        await conn.sendMessage(from, {
          text: `⚠️ WARNING ${count}/3\n@${sender.split("@")[0]} ne link bheja. 3 warnings ke baad remove ho jayega.`,
          mentions: [sender]
        });
      } else {
        try {
          await conn.groupParticipantsUpdate(from, [sender], "remove");
          delete global.warnings[sender];
          await conn.sendMessage(from, { text: `❌ @${sender.split("@")[0]} remove kar diya gaya, warnings khatam ho gayi.`, mentions: [sender] });
        } catch {
          await conn.sendMessage(from, { text: "❌ Bot ke paas remove karne ki permission nahi hai." });
        }
      }

    } catch (err) {
      console.error("Anti-link error:", err);
    }
  }
};
