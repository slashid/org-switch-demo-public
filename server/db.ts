import { ClassicLevel } from 'classic-level'

export const db = new ClassicLevel('./__db', { valueEncoding: 'json' })