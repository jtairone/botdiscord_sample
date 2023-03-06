const { REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path')

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const commands = []
const comandosPath = path.join(__dirname, 'comandos')
const comadosFile = fs.readdirSync(comandosPath).filter(file => file.endsWith(".js"))

for(const file of comadosFile){
    const comando = require(`./comandos/${file}`)
    commands.push(comando.data.toJSON())
}
//instancia REST
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    try{
        console.log(`Resentado ${commands.length} comandos...`)
        //PUT
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );
        console.log(`${commands.length} comandos registrados com sucesso!`)
    }catch(err){
        console.error(err)
    }
})();
