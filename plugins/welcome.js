let handler = async (m, { conn, participants, groupMetadata }) => {
    let who = m.messageStubParameters[0]

    // Bienvenida
    if (m.messageStubType === 27 || m.messageStubType === 31) {
        let name = await conn.getName(who)
        let groupName = groupMetadata.subject

        let texto = `
╭━━〔 BIENVENIDO 〕━━⬣
┃ Hola @${who.split('@')[0]} 👋
┃ Bienvenido a *${groupName}*
┃
┃ Lee las reglas y preséntate 😎
┃ Usa.menu para ver los comandos
╰━━━━━━━━━━━━━━⬣
        `

        await conn.sendMessage(m.chat, {
            text: texto,
            mentions: [who]
        })
    }

    // Despedida
    if (m.messageStubType === 28 || m.messageStubType === 32) {
        let texto = `Adiós @${who.split('@')[0]} 👋 Se fue uno.`
        await conn.sendMessage(m.chat, {
            text: texto,
            mentions: [who]
        })
    }
}

handler.tags = ['welcome']
export default handler