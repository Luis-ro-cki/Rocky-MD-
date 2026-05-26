const { exec } = require('child_process');
const fs = require('fs');

let handler = async (m, { conn, args, command }) => {
    if (!args[0]) {
        return conn.sendMessage(m.chat, {
            text: 'Pon el nombre o link\nEjemplo:.play Shakira'
        }, { quoted: m });
    }

    const query = args.join(' ');
    const path = `./temp_${Date.now()}.mp3`;

    await conn.sendMessage(m.chat, {
        text: `🎵 Buscando: ${query}`
    }, { quoted: m });

    exec(`yt-dlp -f bestaudio -x --audio-format mp3 -o "${path}" ytsearch1:"${query}"`,
    async (err) => {
        if (err) {
            return conn.sendMessage(m.chat, {
                text: 'Error al descargar. Prueba con otro nombre o link.'
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            audio: { url: path },
            mimetype: 'audio/mp4',
            fileName: 'song.mp3',
            ptt: false
        }, { quoted: m });

        fs.unlinkSync(path);
    });
}

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto/link>'];
handler.tags = ['downloader'];

module.exports = handler;