let verdad = [
    "¿Cuál es tu mayor miedo?",
    "¿A quién le diste tu primer beso?",
    "¿Qué es lo más vergonzoso que has hecho?",
    "¿Tienes un crush en el grupo?",
    "¿Cuál es tu peor hábito?"
]

let reto = [
    "Manda un audio cantando 10 seg",
    "Cambia tu foto por 5 min",
    "Escribe en mayúsculas por 10 min",
    "Manda el último meme que guardaste",
    "Haz 10 flexiones y manda video"
]

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Usa: ${usedPrefix + command} verdad/reto\nEjemplo: ${usedPrefix + command} reto`)

    if (args[0] === 'verdad') {
        let pick = verdad[Math.floor(Math.random() * verdad.length)]
        m.reply(`*VERDAD* 😏\n\n${pick}`)
    } else if (args[0] === 'reto') {
        let pick = reto[Math.floor(Math.random() * reto.length)]
        m.reply(`*RETO* 🔥\n\n${pick}`)
    } else {
        m.reply(`Opción no válida. Usa: ${usedPrefix + command} verdad o reto`)
    }
}

handler.help = ['verdad', 'reto']
handler.tags = ['fun']
handler.command = ['verdad', 'reto', 'truth', 'dare']
export default handler