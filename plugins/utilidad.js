import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
    switch(command) {

        case 'ss':
        case 'screenshot':
            if (!args[0]) return m.reply(`Pon un link\nEjemplo: ${usedPrefix}ss google.com`)
            let url = args[0].startsWith('http')? args[0] : 'https://' + args[0]
            let ss = `https://image.thum.io/get/fullpage/${url}`
            await conn.sendMessage(m.chat, {
                image: { url: ss },
                caption: `📸 Screenshot de ${url}`
            })
        break

        case 'qr':
            if (!text) return m.reply(`Pon el texto\nEjemplo: ${usedPrefix}qr hola mundo`)
            let qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`
            await conn.sendMessage(m.chat, {
                image: { url: qr },
                caption: 'Aquí tienes tu QR'
            })
        break

        case 'tr':
        case 'translate':
            if (!args[0] ||!args[1]) return m.reply(`Usa: ${usedPrefix}tr es hello\nCódigos: es, en, fr, pt, it, de, ja`)
            let lang = args[0]
            let txt = args.slice(1).join(' ')
            let res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(txt)}&langpair=en|${lang}`)
            let json = await res.json()
            m.reply(`*Traducido a ${lang}:*\n${json.responseData.translatedText}`)
        break

        case 'clima':
        case 'weather':
            if (!text) return m.reply(`Pon una ciudad\nEjemplo: ${usedPrefix}clima Madrid`)
            let api = await fetch(`https://wttr.in/${encodeURIComponent(text)}?format=4`)
            let clima = await api.text()
            m.reply(clima)
        break

        case 'calc':
        case 'calcular':
            if (!text) return m.reply(`Pon la operación\nEjemplo: ${usedPrefix}calc 2+2*5`)
            try {
                let result = Function('return ' + text)()
                m.reply(`*Operación:* ${text}\n*Resultado:* ${result}`)
            } catch {
                m.reply('Operación inválida. Usa solo números y + - * /')
            }
        break

        case 'letra':
        case 'lyrics':
            if (!text) return m.reply(`Pon el nombre de la canción\nEjemplo: ${usedPrefix}letra Blinding Lights`)
            let res2 = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(text)}`)
            let json2 = await res2.json()
            if (!json2.lyrics) return m.reply('No encontré la letra')
            let letra = json2.lyrics.length > 4000? json2.lyrics.substring(0, 4000) + '...' : json2.lyrics
            m.reply(`*${text}*\n\n${letra}`)
        break

        case 'ping':
            let start = Date.now()
            await m.reply('Pong!')
            let end = Date.now()
            m.reply(`Velocidad: ${end - start}ms`)
        break

        case 'time':
        case 'hora':
            let date = new Date()
            m.reply(`🕐 Hora: ${date.toLocaleTimeString('es-ES')}\n📅 Fecha: ${date.toLocaleDateString('es-ES')}`)
        break

        case 'short':
        case 'acortar':
            if (!args[0]) return m.reply(`Pon un link\nEjemplo: ${usedPrefix}acortar google.com`)
            let short = await fetch(`https://tinyurl.com/api-create.php?url=${args[0]}`)
            let shortUrl = await short.text()
            m.reply(`*Link acortado:*\n${shortUrl}`)
        break
    }
}

handler.help = ['ss link', 'qr texto', 'tr es texto', 'clima ciudad', 'calc 2+2', 'letra canción', 'ping', 'hora', 'acortar link']
handler.tags = ['tools']
handler.command = ['ss', 'screenshot', 'qr', 'translate', 'tr', 'weather', 'clima', 'calc', 'calcular', 'lyrics', 'letra', 'ping', 'time', 'hora', 'short', 'acortar']

export default handler