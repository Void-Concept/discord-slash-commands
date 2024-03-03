import express from 'express';
import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import SecretsManager from 'aws-sdk/clients/secretsmanager';
import { SecretsManagerService } from "./discordInteractions/SecretManagerService";
import { commandSpecs } from './discordInteractions/commands'

const app = express()
const port = 3000

const secretsManager = new SecretsManager()
const secretsManagerService = new SecretsManagerService(secretsManager)

//auth middleware
app.use(async (req, res, next) => {
    const signature = req.header("x-signature-ed25519")
    const timestamp = req.header('x-signature-timestamp')
    const isValid = !!req.body && !!signature && !!timestamp && verifyKey(req.body, signature, timestamp, await secretsManagerService.getDiscordPublicKey())
    if (isValid) {
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
})

app.get('/', async (req, res) => {
    const payload = JSON.parse(req.body || "")
    if (payload.type === InteractionType.PING) {
        return res.send({
            type: InteractionResponseType.PONG
        })
    } else if (payload.type === InteractionType.APPLICATION_COMMAND) {
        const spec = commandSpecs.find(spec => spec.command.name === payload.data.name)
        if (!spec) return res.status(400).send("Unknown Command")

        return res.send(await spec.handler(payload))
    } else if (payload.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
        const spec = commandSpecs.find(spec => spec.command.name === payload.data.name)
        if (!spec || !spec.autoCompleteHandler) return res.status(400).send("Unknown Command")

        return res.send(await spec.autoCompleteHandler(payload))
    }
    return res.status(400).send("Unknown Command")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
