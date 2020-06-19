const discord = require('discord.js')

const client = new discord.Client()



client.once('ready', () => console.log('Vulpie bot is ALIVE!!!'))






client.login(process.env.BOT_TOKEN) // must be the last line 