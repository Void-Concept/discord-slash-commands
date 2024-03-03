import { SecretsManager } from "aws-sdk";

type SecretManagerResponse = {
    apiKey: string
    publicKey: string
    applicationId: string
}

export class SecretsManagerService {
    constructor(private secretsManager: SecretsManager) {

    }

    private getSecret = async (): Promise<SecretManagerResponse> => {
        const secretManagerResponse = await this.secretsManager.getSecretValue({
            SecretId: process.env.discordSecretName!,
        }).promise()

        const secretString = secretManagerResponse.SecretString

        if (!secretString) throw new Error("Could not fetch discord api key")
        return JSON.parse(secretString)
    }

    getDiscordApiKey = async (): Promise<string> => {
        return (await this.getSecret()).apiKey
    }

    getDiscordPublicKey = async (): Promise<string> => {
        return (await this.getSecret()).publicKey
    }
    
    getApplicationId = async (): Promise<string> => {
        return (await this.getSecret()).applicationId
    }
}