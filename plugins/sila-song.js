const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');
const yts = require('yt-search');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363422829058272@newsletter',
            newsletterName: `© ${config.BOT_NAME}`,
            serverMessageId: 143,
        },
    };
};

cmd({
    pattern: "song",
    alias: ["mp3", "play", "audio", "music"],
    react: "🎵",
    desc: "Download song from YouTube",
    category: "download",
    filename: __filename
},
async(conn, mek, m, {from, q, reply}) => {
try{
    if (!q) return reply(`*❌ Please provide a song name or link!*\n\nExample: .song faded`);

    let videoData = null;

    if (q.includes('youtube.com') || q.includes('youtu.be')) {
        const videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
        if (!videoId) return reply("*❌ Invalid YouTube link!*");
        const search = await yts({ videoId: videoId });
        if (search) videoData = search;
    } else {
        const search = await yts(q);
        if (!search || !search.all || search.all.length === 0) {
            return reply(`*❌ No results found for "${q}"*`);
        }
        videoData = search.all[0];
    }

    if (!videoData) return reply("*❌ Could not get video information!*");

    const videoUrl = videoData.url;
    const title = videoData.title || 'Unknown Title';
    const thumbnail = videoData.thumbnail || videoData.image;
    const duration = videoData.timestamp || 'N/A';
    const views = videoData.views ? videoData.views.toLocaleString() : 'N/A';
    const author = videoData.author?.name || 'Unknown Artist';

    try {
        const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const data = response.data;

        if (data?.status && data.audio) {
            // Tuma cover art na caption + audio moja kwa moja
            await conn.sendMessage(from, {
                image: { url: thumbnail },
                caption: `🎵 *${title}*\n👤 *${author}*\n⏱️ *${duration}*\n👁️ *${views}*\n\n> © ${config.BOT_NAME}`,
                contextInfo: getContextInfo({ sender: m.sender })
            }, { quoted: mek });

            await conn.sendMessage(from, {
                audio: { url: data.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                ptt: false,
                contextInfo: getContextInfo({ sender: m.sender })
            }, { quoted: mek });

        } else {
            // Fallback API
            const api2 = `https://meta-api.zone.id/downloader/youtube?url=${encodeURIComponent(videoUrl)}`;
            const res2 = await axios.get(api2, { timeout: 30000 });
            const d2 = res2.data;
            let audioUrl = d2?.result?.audio || d2?.result?.url;

            if (audioUrl) {
                await conn.sendMessage(from, {
                    image: { url: thumbnail },
                    caption: `🎵 *${title}*\n👤 *${author}*\n⏱️ *${duration}*\n👁️ *${views}*\n\n> © ${config.BOT_NAME}`,
                    contextInfo: getContextInfo({ sender: m.sender })
                }, { quoted: mek });

                await conn.sendMessage(from, {
                    audio: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                    ptt: false,
                    contextInfo: getContextInfo({ sender: m.sender })
                }, { quoted: mek });
            } else {
                reply("*❌ Failed to download audio!*");
            }
        }

    } catch (error) {
        console.error(error);
        reply(`*❌ Download failed!*\n${error.message}`);
    }

} catch (e) {
    console.log(e);
    reply(`*❌ Error:* ${e.message}`);
}
});