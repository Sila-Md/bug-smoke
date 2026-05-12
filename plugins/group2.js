const { cmd } = require('../command');

cmd({
    pattern: "promote",
    desc: "Promote a member to admin",
    category: "group",
    react: "📈",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.isGroup) return reply("❌ This command is only for groups!");
        if (!mek.mentionedJid || mek.mentionedJid.length === 0) return reply("❌ Mention a user to promote!");

        const userToPromote = mek.mentionedJid[0];
        await conn.groupParticipantsUpdate(from, [userToPromote], "promote");
        reply(`✅ @${userToPromote.split("@")[0]} has been promoted to admin!`);
    } catch (err) {
        console.error(err);
        reply("❌ Failed to promote member!");
    }
});

cmd({
    pattern: "demote",
    desc: "Demote an admin to member",
    category: "group",
    react: "📉",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.isGroup) return reply("❌ This command is only for groups!");
        if (!mek.mentionedJid || mek.mentionedJid.length === 0) return reply("❌ Mention a user to demote!");

        const userToDemote = mek.mentionedJid[0];
        await conn.groupParticipantsUpdate(from, [userToDemote], "demote");
        reply(`✅ @${userToDemote.split("@")[0]} has been demoted to member.`);
    } catch (err) {
        console.error(err);
        reply("❌ Failed to demote member!");
    }
});

cmd({
    pattern: "kick",
    desc: "Remove a member from the group",
    category: "group",
    react: "🦵",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.isGroup) return reply("❌ This command is only for groups!");
        if (!mek.mentionedJid || mek.mentionedJid.length === 0) return reply("❌ Mention a user to kick!");

        const userToKick = mek.mentionedJid[0];
        await conn.groupParticipantsUpdate(from, [userToKick], "remove");
        reply(`✅ @${userToKick.split("@")[0]} has been removed from the group.`);
    } catch (err) {
        console.error(err);
        reply("❌ Failed to remove member!");
    }
});

cmd({
    pattern: "setdesc",
    desc: "Set group description",
    category: "group",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!m.isGroup) return reply("❌ This command is only for groups!");
        const description = args.join(" ");
        if (!description) return reply("❌ Provide a description. Example: .setdesc Welcome to our group!");

        await conn.groupUpdateDescription(from, description);
        reply("✅ Group description updated!");
    } catch (err) {
        console.error(err);
        reply("❌ Failed to set group description!");
    }
});

cmd({
    pattern: "setname",
    desc: "Set group name/title",
    category: "group",
    react: "✏️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!m.isGroup) return reply("❌ This command is only for groups!");
        const name = args.join(" ");
        if (!name) return reply("❌ Provide a group name. Example: .setname Fun Group");

        await conn.groupUpdateSubject(from, name);
        reply("✅ Group name updated!");
    } catch (err) {
        console.error(err);
        reply("❌ Failed to set group name!");
    }
});
