import { findOption, messageResponse } from "./helpers";
import { CommandSpec, Command, CommandOptionType, Request, ChannelMessageResponse } from "./types";
import { DiceRoll } from '@dice-roller/rpg-dice-roller'

export const Options = {
    dice: 'dice'
}

export const command: Command = {
    name: "roll",
    description: "Roll a dice",
    options: [{
        name: Options.dice,
        type: CommandOptionType.STRING,
        description: "The dice you want to roll. ie: 1d20",
        required: true,
        autocomplete: false,
    }]
}

export const handler = (rollDice: (diceStr: string) => string) => async (request: Request): Promise<ChannelMessageResponse> => {
    const diceStringOption = request.data.options?.find(findOption(Options.dice))
    if (!diceStringOption) return messageResponse('Invalid option: dice')

    const diceRoll = rollDice(diceStringOption.value as string)

    return messageResponse(`${diceRoll}`)
}

export const defaultRollDice = (diceStr: string): string => {
    try {
        return new DiceRoll(diceStr).output
    } catch (e) {
        return "Error: invalid input"
    }
}

export const commandSpec: CommandSpec = {
    command,
    handler: handler(defaultRollDice),
}
