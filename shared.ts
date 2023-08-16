export const ADMIN = "admin"
export const COLLABORATOR = "collaborator"
const groups = [ADMIN, COLLABORATOR] as const
export type Group = typeof groups[number]
