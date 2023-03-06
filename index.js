const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env

//importação do comandos
const fs = require('fs')
const path = require('path')

const comandosPath = path.join(__dirname, 'comandos')
const coamndosFile = fs.readdirSync(comandosPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

for(const file of coamndosFile){
  const filePath = path.join(comandosPath, file)
  const comando = require(filePath)
  if('data' in comando && 'execute' in comando){
      client.commands.set(comando.data.name, comando)
  }else{
    console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausente`)
  }
}

client.once(Events.ClientReady, c => {
	console.log(`Logado sucesso ${c.user.tag}`)
})

client.login(TOKEN)

client.on(Events.InteractionCreate, async interacao =>{
  if(interacao.isStringSelectMenu()){
    const selecionado = interacao.values[0]
    if(selecionado == 'javascript'){
        await interacao.reply("Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript")
    } else if (selecionado == "python"){
        await interacao.reply("Documentação do Python: https://www.python.org")
    } else if (selecionado == "csharp"){
        await interacao.reply("Documentação do C#: https://learn.microsoft.com/en-us/dotnet/csharp/")
    } else if (selecionado == "discordjs"){
        await interacao.reply("Documentação do Discord.js: https://discordjs.guide/#before-you-begin")
    }
  }
  if(!interacao.isChatInputCommand()) return
  //console.log(interacao)
  const comando = interacao.client.commands.get(interacao.commandName)
  if(!comando){
    console.error("Comando não encontrado")
    return
  }
  try{
    await comando.execute(interacao)
  }catch(err){
    console.log(err)
    await interacao.reply("Houve um erro ao executar o comando")
  }
  
   
})