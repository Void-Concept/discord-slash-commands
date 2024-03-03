import { ChannelMessageResponse, CommandSpec, RequestOption } from './types'
import { InteractionResponseType } from 'discord-interactions';

export const messageResponse = (content: string): ChannelMessageResponse => ({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        content
    }
})

export const findOption = (optionName: string) =>
    (option: RequestOption): boolean =>
        option.name === optionName

export const aliasSpec = (commandSpec: CommandSpec, alias: string): CommandSpec => {
    return {
        ...commandSpec,
        command: {
            ...commandSpec.command,
            name: alias
        }
    }
}