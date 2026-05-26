let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Ejemplo: ${usedPrefix + command} https://youtu.be/abc123`)
  
  try {
    m.react('⏳')
    let res = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(text)}`)
    let json = await res.json()
    
    if (!json.data?.dl) throw 'No se pudo descargar'
    
    await conn.sendMessage(m.chat, {
      audio: { url: json.data.dl },
      mimetype: 'audio/mpeg',
      fileName: `${json.data.title}.mp3`
    }, { quoted: m })
    
    m.react('✅')
  } catch (e) {
    m.reply('Error al descargar el audio')
    console.log(e)
  }
}

handler.help = ['ytmp3 <link>']
handler.tags = ['downloader']
handler.command = ['ytmp3', 'yta']

export default handler