import { InteractionType } from 'discord-interactions'
import { defaultRollDice, handler, Options } from './roll'
import { RequestOption, Request, CommandOptionType } from './types'
import { DiceRoll } from '@dice-roller/rpg-dice-roller'

describe('roll', () => {
    const createRequest = (options: RequestOption[]): Request => ({
        type: InteractionType.APPLICATION_COMMAND,
        data: {
            options: options
        }
    } as Request)

    it('should return an error if given bad input', async () => {
        const request = createRequest([{
            name: Options.dice,
            type: CommandOptionType.STRING,
            value: 'lol'
        }])

        const response = await handler(defaultRollDice)(request)

        expect(response.data.content).toEqual('Error: invalid input')
    })

    it('should return an error if given no input', async () => {
        const request = createRequest([])

        const response = await handler(defaultRollDice)(request)

        expect(response.data.content).toEqual('Invalid option: dice')
    })

    it('should return the results of the DiceRoll library', async () => {
        const request = createRequest([{
            name: Options.dice,
            type: CommandOptionType.STRING,
            value: '1d20 + 1d10'
        }])

        const diceRoll = defaultRollDice('1d20 + 1d10')

        const response = await handler(() => diceRoll)(request)

        expect(response.data.content).toEqual(diceRoll)
    })
})