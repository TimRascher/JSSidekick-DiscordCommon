import { Routes } from "discord.js"
import { REST } from "discord.js"
import { LoadCommands } from "./dynamic-command-loader.js"

/**
 * @readonly
 * @enum { Number }
 */
const RegisterType = {
    guild: 1,
    global: 2
}

/**
 * @typedef { Object } RegisterOptions
 * @property { String } token
 * @property { String } clientId
 * @property { String } [guildId]
 * @property { RegisterType } type
 * @property { String } [path]
 * @property { Boolean } [deleteAll]
 */

/**
 * @param { RegisterOptions } [options]
 */
export default async (options) => {
    const ops = {
        token: options?.token || process.env.TOKEN,
        clientId: options?.clientId || process.env.CLIENTID,
        guildId: options?.guildId || process.env.GUILDID,
        type: options?.type || RegisterType.global,
        path: options?.path,
        deleteAll: options?.deleteAll || false
    }
    let commands = []
    if (ops.deleteAll == false) {
        const rawCommands = await LoadCommands(ops.path)
        commands = rawCommands.map(cmd => cmd.data.toJSON())
    }
    const rest = new REST({ version: "10" }).setToken(ops.token)
    const route = ops.type == RegisterType.global ?
        Routes.applicationCommands(ops.clientId) : Routes.applicationGuildCommands(ops.clientId, ops.guildId)
    try {
        const data = await rest.put(route, { body: commands })
        if (ops.deleteAll == false) {
            console.log(`Successfully registered ${data.length} application commands.`)
        } else {
            console.log(`All commands deleted.`)
        }
    } catch (error) {
        console.error(error)
    }
}
