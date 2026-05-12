const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "alive",
    alias: ["a", "status", "runtime", "uptime"],
    desc: "Check if bot is alive and running",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushname }) => {
    try {
        // Calculate uptime
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const uptimeString = `${hours}h ${minutes}m ${seconds}s`;
        
        // Get memory usage
        const usedMemory = (os.totalmem() - os.freemem()) / 1024 / 1024;
        const totalMemory = os.totalmem() / 1024 / 1024;
        const memoryPercent = Math.round((usedMemory / totalMemory) * 100);
        
        // Get platform info
        const platform = os.platform();
        const nodeVersion = process.version;
        
        // Stylish alive message
        const aliveText = 
`╔══════════════════════════════════╗
║     🟢 𝐀𝐋𝐈𝐕𝐄 🟢                  ║
╠══════════════════════════════════╣
║  🤖 𝐁𝐨𝐭: 𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃           ║
║  📊 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐎𝐍𝐋𝐈𝐍𝐄              ║
║  ⏰ 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString.padEnd(18)}║
╠══════════════════════════════════╣
║  💻 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦: ${platform.padEnd(17)}║
║  🧠 𝐌𝐞𝐦𝐨𝐫𝐲: ${Math.round(usedMemory)}MB / ${Math.round(totalMemory)}MB (${memoryPercent}%)  ║
║  📦 𝐍𝐨𝐝𝐞: ${nodeVersion.padEnd(19)}║
╠══════════════════════════════════╣
║  👤 𝐔𝐬𝐞𝐫: @${sender.split('@')[0].padEnd(16)}║
╚══════════════════════════════════╝

⚡𝐏𝐨𝐰𝐞𝐫 𝐛𝐲 ʟᴜᴋᴀ ιт⚡`;
        
        // Send with image and external ad reply
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/8a9abd.png' },
            caption: aliveText,
            mentions: [sender],
            contextInfo: {
                externalAdReply: {
                    title: '𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃',
                    body: '✅ Bot is running smoothly',
                    thumbnailUrl: 'https://files.catbox.moe/8a9abd.png',
                    sourceUrl: 'https://github.com/lucvoice/LUCVOICE-XMD',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
    } catch (e) {
        console.log("Alive Error:", e);
        reply("❌ Error checking status!");
    }
});
