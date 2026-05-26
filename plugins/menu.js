let handler = async (m, { conn, usedPrefix }) => {
    let name = m.pushName || 'Usuario'
    let time = new Date()
    let hours = time.getHours()
    
    let greeting = hours < 12 ? 'Buenos días' : hours < 18 ? 'Buenas tardes' : 'Buenas noches'

    let menu = `
*╭━━〔 ${conn.user.name} 〕━━⬣*
*┃* Hola ${name} 👋
*┃* ${greeting}
*┃* Prefijo: [ ${usedPrefix} ]
*╰━━━━━━━━━━⬣*

*╭━━〔 👑 ADMIN 〕━━⬣*
*┃* ${usedPrefix}kick @tag
*┃* ${usedPrefix}promote @tag
*┃* ${usedPrefix}demote @tag
*┃* ${usedPrefix}group open/close
*┃* ${usedPrefix}hidetag texto
*╰━━━━━━━━━━⬣*

*╭━━〔 💰 ECONOMÍA 〕━━⬣*
*┃* ${usedPrefix}balance
*┃* ${usedPrefix}work
*┃* ${usedPrefix}daily
*┃* ${usedPrefix}transfer @tag cantidad
*┃* ${usedPrefix}shop
*╰━━━━━━━━━━⬣*

*╭━━〔 🔧 UTILIDAD 〕━━⬣*
*┃* ${usedPrefix}ss link
*┃* ${usedPrefix}qr texto
*┃* ${usedPrefix}tr es texto
*┃* ${usedPrefix}clima ciudad
*┃* ${usedPrefix}calc 2+2
*┃* ${usedPrefix}letra canción
*┃* ${usedPrefix}ping
*┃* ${usedPrefix}hora
*┃* ${usedPrefix}acortar link
*╰━━━━━━━━━━⬣*

*╭━━〔 📥 DESCARGAS 〕━━⬣*
*┃* ${usedPrefix}ytmp3 link
*┃* ${usedPrefix}ytmp4 link
*┃* ${usedPrefix}tiktok link
*╰━━━━━━━━━━⬣*

*╭━━〔 🤖 IA 〕━━⬣*
*┃* ${usedPrefix}gpt pregunta
*╰━━━━━━━━━━⬣*

> Escribe ${usedPrefix}help para más info
    `

    await conn.sendMessage(m.chat, {
        text: menu,
        contextInfo: {
            externalAdReply: {
                title: conn.user.name,
                body: 'Bot activo',
                thumbnailUrl: 'https://files.catbox.moe/3z3v6p.jpg',
                sourceUrl: 'https://github.com'
            }
        }
    })
}

handler.help = ['menu', 'help', 'menú']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú']

export default handler