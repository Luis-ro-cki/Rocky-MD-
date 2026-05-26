let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Ejemplo: ${usedPrefix + command} Hola, ¿cómo estás?`)
  
  try {
    m.react('⏳')
    let res = await fetch(`https://api.siputzx.my.id/api/ai/gpt-4?prompt=${encodeURIComponent(text)}`)
    let json = await res.json()
    
    if (!json.data) throw 'Error al obtener respuesta'
    m.reply(json.data)
    m.react('✅')
  } catch (e) {
    m.reply('Ocurrió un error, intenta de nuevo')
    console.log(e)
  }
}

handler.help = ['gpt <texto>']
handler.tags = ['ai']
handler.command = ['gpt', 'ai', 'chatgpt']

export default handler