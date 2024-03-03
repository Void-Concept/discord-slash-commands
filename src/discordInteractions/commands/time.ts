import { InteractionResponseType } from 'discord-interactions';
import { AutoCompleteChoice, AutoCompleteResponse, Command, CommandOptionType, Request, ChannelMessageResponse } from './types'
import { zonedTimeToUtc } from 'date-fns-tz'
import { getTimeZones } from '@vvo/tzdb';
import { parse, isValid } from 'date-fns';
import { messageResponse } from './helpers';

const hardCodedimeZones = [{
    name: "UTC",
    value: "UTC"
}, {
    name: "Eastern",
    value: "America/New_York"
}, {
    name: "Central",
    value: "America/Chicago"
}, {
    name: "Mountain",
    value: "America/Denver"
}, {
    name: "Pacific",
    value: "America/Los_Angeles"
}, {
    name: "Hawaii",
    value: "Pacific/Honolulu"
}]

const tzdbZones = getTimeZones({
    includeUtc: true
})
  
const canonicalNameOptions = tzdbZones.map(zone => ({
    name: zone.name,
    value: zone.name,
}))

const allTimeZones = [...hardCodedimeZones, ...canonicalNameOptions]

export const command: Command = {
    name: "time",
    description: "Translate time using discord's time format function",
    options: [{
        name: "timezone",
        type: CommandOptionType.STRING,
        description: "Timezone you are translating from",
        required: true,
        autocomplete: true,
    }, {
        name: "time",
        type: CommandOptionType.STRING,
        description: "Time string. ie: 10:00am",
        required: true,
    }, {
        name: "date",
        type: CommandOptionType.STRING,
        description: "Date in the format YYYY-MM-DD. Optional: will default to today",
    }]
}

const timeFormats = [
    "hh:mmaa",
    "hh:mm aa",
    "HH:mm",
    "hh",
    "hhaa",
    "HH",
]

const parseTimePart = (timeString: string, datePart: Date): Date | undefined => {
    return timeFormats
        .map(format => parse(timeString, format, datePart))
        .find(parsed => isValid(parsed))
}


export const handler = async (request: Request): Promise<ChannelMessageResponse> => {
    const timezoneOption = request.data.options?.find(option => option.name === 'timezone')
    const timezone = hardCodedimeZones.find(zone => zone.name.toLowerCase() === (timezoneOption?.value as string).toLowerCase()) || timezoneOption // fix if they submit before autocorrect translates
    
    const time = request.data.options?.find(option => option.name === 'time')
    const date = request.data.options?.find(option => option.name === 'date')

    const datePart = date && parse(date.value as string, "yyyy-MM-dd", new Date()) || new Date()
    const timePart = parseTimePart(time!.value as string, datePart)

    if (!timePart) return messageResponse("Entered time is invalid")

    const utcTime = zonedTimeToUtc(timePart, timezone!.value as string)
    const utcTimeNum = Math.floor(utcTime.getTime() / 1000)

    if (!isValid(utcTime)) return messageResponse("Entered time is invalid")

    return messageResponse(`<t:${utcTimeNum}:F>`)
}

const autoCompleteResult = (choices: AutoCompleteChoice[]): AutoCompleteResponse => ({
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
        choices
    }
})

export const autoCompleteHandler = async (request: Request): Promise<AutoCompleteResponse> => {
    const focusedField = request.data.options?.find(option => option.focused)
    
    if (!focusedField) return autoCompleteResult([])

    if (focusedField.name === 'timezone') {
        const suggestions = allTimeZones
            .filter(timeZone => timeZone.name.toLowerCase().startsWith((focusedField.value as string).toLowerCase()))

        return autoCompleteResult(suggestions.slice(0, 25))
    }

    return autoCompleteResult([])
}


export const commandSpec = {
    command,
    handler,
    autoCompleteHandler,
}