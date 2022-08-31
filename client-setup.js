import Discord, { Client, Partials } from "discord.js"

export default () => {
    let intents = new Discord.IntentsBitField()
    const I = Discord.IntentsBitField.Flags
    intents.add(I.DirectMessages)
    intents.add(I.DirectMessageReactions)
    intents.add(I.DirectMessageTyping)
    intents.add(I.Guilds)
    intents.add(I.GuildMessages)
    intents.add(I.MessageContent)
    return new Client({ intents: intents,  partials: [ Partials.Channel ] })
}