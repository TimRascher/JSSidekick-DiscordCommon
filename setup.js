import ClientSetup from "./client-setup.js"
import { LoadCollection } from "./dynamic-command-loader.js"
import fs from "fs/promises"

const Setup = async () => {
    const client = ClientSetup()
    const loadCollection = async (dir, checkCmd, nameLocation) => {
        try {
            const path = `${process.cwd()}/${dir}`
            await fs.access(path)
            client[dir] = await LoadCollection({ path: path })
        } catch (error) { console.error(error); return }
        client.on("interactionCreate", async (interaction) => {
            if (!interaction[checkCmd]()) { return }
            const command = interaction.client[dir].get(interaction[nameLocation])
            if (!command) { return }
            try {
                await command.execute(interaction)
            } catch (error) {
                console.error(error)
                await interaction.reply({ content: "There was an error.", ephemeral: true })
            }
        })
    }
    await loadCollection("commands", "isChatInputCommand", "commandName")
    await loadCollection("buttons", "isButton", "customId")
    return client
}

export default Setup