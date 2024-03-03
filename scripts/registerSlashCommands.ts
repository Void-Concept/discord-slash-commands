import fetch from "node-fetch";
import { commandSpecs, Command } from '../src/discordInteractions/commands'
import { SecretsManagerService } from '../src/discordInteractions/SecretManagerService'
import SecretsManager from 'aws-sdk/clients/secretsmanager';

const register = async () => {
    const secretsManager = new SecretsManager({
        region: "us-east-1"
    })
    const secretsManagerService = new SecretsManagerService(secretsManager)
    
    const token = await secretsManagerService.getDiscordApiKey()
    const applicationId = await secretsManagerService.getApplicationId()

    const commands: Command[] = commandSpecs.map(spec => spec.command)

    const response = await fetch(
        `https://discord.com/api/v8/applications/${applicationId}/commands`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${token}`,
          },
          method: "PUT",
          body: JSON.stringify(commands),
        }
      );
      
      if (response.ok) {
        console.log("Registered all commands");
      } else {
        console.error("Error registering commands");
        const text = await response.text();
        console.error(text);
      }
}

register().catch(console.error)
