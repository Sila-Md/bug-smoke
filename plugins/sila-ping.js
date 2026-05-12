const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "ping",
    desc: "Check bot speed",
    category: "main",
    react: "🏓",
    filename: __filename
},
async (conn, mek, m, { from }) => {

    try {
        const start = Date.now();

        // Tuma message tupu kwanza
        const msg = await conn.sendMessage(from, { text: "..." }, { quoted: mek });

        const end = Date.now();
        const speed = end - start;

        // Edit na kuweka speed
        await conn.sendMessage(from, { 
            text: `*${config.BOT_NAME}*\n${speed} ms ⚡`,
            edit: msg.key
        });

    } catch (e) {
        console.log(e);
    }
});