import { pathToFileURL } from 'url'
import { Collection } from "discord.js"
import fs from "fs"

/**
 * @typedef { Object } Command
 * @property { import("discord.js").SlashCommandBuilder } data
 * @property { (import("discord.js").Interaction) => Undefined } execute
 */

/**
 * @typedef { Object } LoadOptions
 * @property { String } [path]
 * @property { Function } [doBeforeAdding] - Only used when loading a Collection.
 */

/**
 * @param { LoadOptions } [options]
 * @return { Command[] }
 */
const LoadCommands = async (options) => {
    const opts = {
        path: options?.path || `${process.cwd()}/commands`
    }
    const commandFiles = fs.readdirSync(opts.path).filter(f => f.endsWith(".js"))
    let commands = []
    for (let i = 0; i < commandFiles.length; i++) {
        const filePath = `${opts.path}/${commandFiles[i]}`
        const url = pathToFileURL(filePath)
        const { default: command } = await import(url)
        commands.push(command)
    }
    return commands
}
/**
 * @param { LoadOptions } options 
 * @return { Collection }
 */
const LoadCollection = async (options) => {
    const opts = {
        path: options?.path,
        doBeforeAdding: options?.doBeforeAdding || ((obj) => {  })
    }
    const commands = await LoadCommands(opts)
    let collection = new Collection()
    commands.forEach(cmd => {
        opts.doBeforeAdding(cmd)
        collection.set(cmd.data.name, cmd)
    })
    return collection
}

export { LoadCommands, LoadCollection }