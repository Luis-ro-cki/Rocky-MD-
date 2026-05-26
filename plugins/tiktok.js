let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Ejemplo: ${usedPrefix + command} https://tiktok.com/@user/video/123`)
  
  try {
    m.react('⏳')
    let res = await fetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(text)}`)
    let json = await res.json()
    
    if (!json.data?.video) throw 'No se pudo descargar'
    
    await conn.sendMessage(m.chat, {
      video: { url: json.data.video },
      caption: json.data.title || 'TikTok descargado'
    }, { quoted: m })
    
    m.react('✅')
  } catch (e) {
    m.reply('Error al descargar el TikTok')
    console.log(e)
  }
}

handler.help = ['tiktok <link>']
handler.tags = ['downloader']
handler.command = ['tiktok', 'tt']

export default handler