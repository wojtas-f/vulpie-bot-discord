const discord = require('discord.js')

const client = new discord.Client()



client.on('ready', () => console.log('Vulpie bot is ALIVE!!!'))

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!')
    }
})

client.on('message', msg => {
    if (msg.content === 'what is my avatar') {
        msg.reply(msg.author.displayAvatarURL())
    }
})


client.login(process.env.BOT_TOKEN) // must be the last line 