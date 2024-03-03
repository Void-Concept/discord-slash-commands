import { commandSpec as timeCommandSpec } from './time'
import { commandSpec as rollCommandSpec } from './roll'
import { CommandSpec } from './types'
import { aliasSpec } from './helpers'
export * from './types'

export const commandSpecs: CommandSpec[] = [
    timeCommandSpec,
    rollCommandSpec,
    aliasSpec(rollCommandSpec, 'r'),
]
