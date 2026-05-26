let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Ejemplo: ${usedPrefix + command} https://youtu.be/abc123`)
  
  try {
    m.react('⏳')
    let res = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`)
    let json = await res.json()
    
    if (!json.data?.dl) throw 'No se pudo descargar'
    
    await conn.sendMessage(m.chat, {
      video: { url: json.data.dl },
      caption: json.data.title || 'Aquí tienes tu video'
    }, { quoted: m })
    
    m.react('✅')
  } catch (e) {
    m.reply('Error al descargar el video')
    console.log(e)
  }
}

handler.help = ['ytmp4 <link>']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'ytv']

export default handler