let handler = async (m, { conn, usedPrefix }) => {
  let menu = `
╭─「 *MENU BOT* 」
│
│ Hola ${m.pushName} 👋
│ Aquí tienes los comandos:
│
│ ${usedPrefix}gpt <texto>
│ ${usedPrefix}ytmp4 <link>
│ ${usedPrefix}ytmp3 <link> 
│ ${usedPrefix}tiktok <link>
│
╰──────────────`

  await conn.sendMessage(m.chat, { 
    text: menu,
    contextInfo: {
      externalAdReply: {
        title: 'Bot WhatsApp',
        body: 'Menú de comandos',
        thumbnailUrl: 'https://i.ibb.co/2kR5S0J/logo.jpg',
        sourceUrl: 'https://wa.me/'
      }
    }
  }, { quoted: m })
}

handler.help = ['menu', 'help']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú']

export default handler