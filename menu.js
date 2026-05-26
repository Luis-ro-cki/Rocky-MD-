let handler = async (m, { conn }) => {
let menu = `*BOT FULL APIS*

*DESCARGAS*
.ytmp4 <link> - Video YT
.ytmp3 <link> - Audio YT  
.tiktok <link> - Video TT
.ig <link> - Instagram

*IA*
.gpt <texto> - Chat GPT

*BUSQUEDAS*
.google <texto> - Buscar Google

*HERRAMIENTAS*
.sticker - Responde a imagen
.clima <ciudad> - Ver clima

*MODERACIÓN*
.tagall - Mencionar todos`
await conn.reply(m.chat, menu, m)
}
handler.command = ['menu', 'help', 'ayuda']
export default handler