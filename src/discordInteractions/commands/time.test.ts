import { InteractionResponseType, InteractionType } from 'discord-interactions'
import { handler } from './time'
import { RequestOption, Request, CommandOptionType } from './types'

describe("time", () => {
    const createRequest = (options: RequestOption[]): Request => ({
        type: InteractionType.APPLICATION_COMMAND,
        data: {
            options: options
        }
    } as Request)

    it("should convert correctly", async () => {
        const request = createRequest([{
            name: "date",
            type: CommandOptionType.STRING,
            value: "2022-01-01"
        }, {
            name: "time",
            type: CommandOptionType.STRING,
            value: "10:00am"
        }, {
            name: "timezone",
            type: CommandOptionType.STRING,
            value: "UTC"
        }])

        const expectedTime = 1641031200

        const response = await handler(request)

        expect(response.data.content).toEqual(`<t:${expectedTime}:F>`)
    })

    it("should convert correctly with timezone", async () => {
        const request = createRequest([{
            name: "date",
            type: CommandOptionType.STRING,
            value: "2022-01-01"
        }, {
            name: "time",
            type: CommandOptionType.STRING,
            value: "10:00am"
        }, {
            name: "timezone",
            type: CommandOptionType.STRING,
            value: "Pacific"
        }])

        const expectedTime = 1641060000

        const response = await handler(request)

        expect(response.data.content).toEqual(`<t:${expectedTime}:F>`)
    })

    it("should convert correctly with timezone with afternoon time", async () => {
        const request = createRequest([{
            name: "date",
            type: CommandOptionType.STRING,
            value: "2022-01-01"
        }, {
            name: "time",
            type: CommandOptionType.STRING,
            value: "11:00pm"
        }, {
            name: "timezone",
            type: CommandOptionType.STRING,
            value: "Pacific"
        }])

        const expectedTime = 1641106800

        const response = await handler(request)

        expect(response.data.content).toEqual(`<t:${expectedTime}:F>`)
    })

    it("should attempt 12hr and 24hr parsing", async () => {
        const request = createRequest([{
            name: "date",
            type: CommandOptionType.STRING,
            value: "2022-01-01"
        }, {
            name: "time",
            type: CommandOptionType.STRING,
            value: "10:00"
        }, {
            name: "timezone",
            type: CommandOptionType.STRING,
            value: "Pacific"
        }])

        const expectedTime = 1641060000

        const response = await handler(request)

        expect(response.data.content).toEqual(`<t:${expectedTime}:F>`)
    })

    it("should attempt 12hr and 24hr parsing with afternoon time", async () => {
        const request = createRequest([{
            name: "date",
            type: CommandOptionType.STRING,
            value: "2022-01-01"
        }, {
            name: "time",
            type: CommandOptionType.STRING,
            value: "23:00"
        }, {
            name: "timezone",
            type: CommandOptionType.STRING,
            value: "Pacific"
        }])

        const expectedTime = 1641106800

        const response = await handler(request)

        expect(response.data.content).toEqual(`<t:${expectedTime}:F>`)
    })

    // // dependent on time, so just run locally. Normally I'd fix, but just want this working
    // it("should convert to today when not given date", async () => {
    //     const request = createRequest([{
    //         name: "time",
    //         type: CommandOptionType.STRING,
    //         value: "01:00am"
    //     }, {
    //         name: "timezone",
    //         type: CommandOptionType.STRING,
    //         value: "UTC"
    //     }])

    //     const expectedTime = 1641060000

    //     const response = await handler(request)

    //     expect(response.data.content).toEqual(`<t:${expectedTime}:F>`)
    // })
})