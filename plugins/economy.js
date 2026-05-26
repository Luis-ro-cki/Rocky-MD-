import fs from 'fs'
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    if (!user) global.db.data.users[m.sender] = { money: 0, bank: 0, lastwork: 0, lastrob: 0 }

    switch(command) {
        case 'work':
        case 'trabajar':
            let time = 300000
            if (new Date - user.lastwork < time) return m.reply(`Ya trabajaste. Espera ${msToTime(time - (new Date - user.lastwork))} para volver a trabajar`)

            let money = Math.floor(Math.random() * 500) + 100
            user.money += money
            user.lastwork = new Date * 1
            m.reply(`Trabajaste duro y ganaste $${money}`)
        break

        case 'rob':
        case 'robar':
            let time2 = 600000
            if (new Date - user.lastrob < time2) return m.reply(`Acabas de robar. Espera ${msToTime(time2 - (new Date - user.lastrob))} para volver a robar`)

            let target = m.mentionedJid[0]
            if (!target) return m.reply(`Etiqueta a quien quieres robar\nEjemplo: ${usedPrefix}robar @usuario`)
            if (target === m.sender) return m.reply('No te puedes robar a ti mismo')

            let targetUser = global.db.data.users[target]
            if (!targetUser || targetUser.money < 100) return m.reply('Ese usuario no tiene dinero suficiente')

            let robMoney = Math.floor(Math.random() * targetUser.money / 2)
            targetUser.money -= robMoney
            user.money += robMoney
            user.lastrob = new Date * 1
            m.reply(`Robaste $${robMoney} a @${target.split('@')[0]}`, { mentions: [target] })
        break

        case 'balance':
        case 'bal':
            m.reply(`💰 *Balance de @${m.sender.split('@')[0]}*\n\n👜 Cartera: $${user.money}\n🏦 Banco: $${user.bank}\n\nTotal: $${user.money + user.bank}`, { mentions: [m.sender] })
        break

        case 'transfer':
        case 'dar':
            let amount = parseInt(args[1])
            let who = m.mentionedJid[0]
            if (!who) return m.reply(`Etiqueta a quien transferir\nEjemplo: ${usedPrefix}dar @usuario 500`)
            if (!amount || amount < 1) return m.reply('Pon una cantidad válida')
            if (user.money < amount) return m.reply('No tienes tanto dinero')

            user.money -= amount
            global.db.data.users[who].money += amount
            m.reply(`Transferiste $${amount} a @${who.split('@')[0]}`, { mentions: [who] })
        break

        case 'top':
        case 'lb':
            let users = Object.entries(global.db.data.users).map(([key, value]) => {
                return {...value, jid: key }
            })
            let sorted = users.sort((a, b) => (b.money + b.bank) - (a.money + a.bank))
            let top = sorted.slice(0, 10)

            let txt = '*🏆 Top Ricos*\n\n'
            top.forEach((v, i) => {
                txt += `${i + 1}. @${v.jid.split('@')[0]} - $${v.money + v.bank}\n`
            })
            m.reply(txt, { mentions: top.map(v => v.jid) })
        break

        case 'deposit':
        case 'dep':
            let dep = parseInt(args[0])
            if (!dep || dep < 1) return m.reply('Pon la cantidad a depositar')
            if (user.money < dep) return m.reply('No tienes tanto dinero')
            user.money -= dep
            user.bank += dep
            m.reply(`Depositaste $${dep} al banco`)
        break

        case 'withdraw':
        case 'retirar':
            let wit = parseInt(args[0])
            if (!wit || wit < 1) return m.reply('Pon la cantidad a retirar')
            if (user.bank < wit) return m.reply('No tienes tanto dinero en el banco')
            user.bank -= wit
            user.money += wit
            m.reply(`Retiraste $${wit} del banco`)
        break
    }
}

handler.help = ['work', 'rob @user', 'balance', 'transfer @user amount', 'top', 'deposit amount', 'withdraw amount']
handler.tags = ['economy']
handler.command = ['work', 'trabajar', 'rob', 'robar', 'balance', 'bal', 'transfer', 'dar', 'top', 'lb', 'deposit', 'dep', 'withdraw', 'retirar']

export default handler

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours = (hours < 10)? "0" + hours : hours
    minutes = (minutes < 10)? "0" + minutes : minutes
    seconds = (seconds < 10)? "0" + seconds : seconds

    return minutes + "m " + seconds + "s"
}