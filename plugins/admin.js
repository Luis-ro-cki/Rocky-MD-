let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) => {
    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos')
    if (!isAdmin) return m.reply('Solo los admins pueden usar esto')
    if (!isBotAdmin) return m.reply('Hazme admin primero para usar estos comandos')

    let who = m.mentionedJid[0] || (m.quoted? m.quoted.sender : false)

    switch(command) {
        case 'kick':
            if (!who) return m.reply(`Etiqueta a alguien\nEjemplo: ${usedPrefix}kick @usuario`)
            await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
            m.reply(`@\${who.split('@')[0]} fue eliminado del grupo`, { mentions: [who] })
        break

        case 'add':
            if (!args[0]) return m.reply(`Pon el número\nEjemplo: ${usedPrefix}add 521234567890`)
            let num = args[0].replace(/[^0-9]/g, '')
            await conn.groupParticipantsUpdate(m.chat, [\${num}@s.whatsapp.net], 'add')
            m.reply(`Usuario agregado`)
        break

        case 'promote':
            if (!who) return m.reply(`Etiqueta a alguien\nEjemplo: ${usedPrefix}promote @usuario`)
            await conn.groupParticipantsUpdate(m.chat, [who], 'promote')
            m.reply(`@\${who.split('@')[0]} ahora es admin`, { mentions: [who] })
        break

        case 'demote':
            if (!who) return m.reply(`Etiqueta a alguien\nEjemplo: ${usedPrefix}demote @usuario`)
            await conn.groupParticipantsUpdate(m.chat, [who], 'demote')
            m.reply(`@\${who.split('@')[0]} ya no es admin`, { mentions: [who] })
        break

        case 'group':
            if (args[0] === 'open') {
                await conn.groupSettingUpdate(m.chat, 'not_announcement')
                m.reply('Grupo abierto. Todos pueden escribir.')
            } else if (args[0] === 'close') {
                await conn.groupSettingUpdate(m.chat, 'announcement')
                m.reply('Grupo cerrado. Solo admins pueden escribir.')
            } else {
                m.reply(`Usa: ${usedPrefix}group open o ${usedPrefix}group close`)
            }
        break

        case 'antilink':
            if (args[0] === 'on') {
                global.db.data.chats[m.chat].antilink = true
                m.reply('Antilink activado. Los links serán eliminados.')
            } else if (args[0] === 'off') {
                global.db.data.chats[m.chat].antilink = false
                m.reply('Antilink desactivado.')
            } else {
                m.reply(`Usa: ${usedPrefix}antilink on/off`)
            }
        break

        case 'tagall':
            let teks = args.join(' ') || 'Atención todos!'
            let members = m.metadata.participants.map(v => v.id)
            m.reply(`*${teks}*\n\n` + members.map(v => '@' + v.split('@')[0]).join('\n'), { mentions: members })
        break

        case 'hidetag':
            let msg = args.join(' ') || 'Mensaje oculto'
            let members2 = m.metadata.participants.map(v => v.id)
            await conn.sendMessage(m.chat, { text: msg, mentions: members2 })
        break

        case 'setname':
            if (!args[0]) return m.reply('Pon el nuevo nombre del grupo')
            let name = args.join(' ')
            await conn.groupUpdateSubject(m.chat, name)
            m.reply(`Nombre cambiado a: ${name}`)
        break

        case 'setdesc':
            if (!args[0]) return m.reply('Pon la nueva descripción')
            let desc = args.join(' ')
            await conn.groupUpdateDescription(m.chat, desc)
            m.reply('Descripción actualizada')
        break

        case 'link':
            let link = await conn.groupInviteCode(m.chat)
            m.reply(`Link del grupo:\nhttps://chat.whatsapp.com/${link}`)
        break

        case 'revoke':
            await conn.groupRevokeInvite(m.chat)
            m.reply('Link del grupo reseteado')
        break
    }
}

handler.help = [
    'kick @user', 'add 521234', 'promote @user', 'demote @user',
    'group open/close', 'antilink on/off', 'tagall', 'hidetag',
    'setname texto', 'setdesc texto', 'link', 'revoke'
]
handler.tags = ['group']
handler.command = ['kick', 'add', 'promote', 'demote', 'group', 'antilink', 'tagall', 'hidetag', 'setname', 'setdesc', 'link', 'revoke']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler