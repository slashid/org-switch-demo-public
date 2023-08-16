import { env } from "./env"
import { GroupsService } from '../slashid'
import { Group } from "../shared"

export const createGroups = async () => {
  const { ROOT_ORG_ID } = env()
  const groups: { name: Group, description: string }[] = [
    { name: "collaborator", description: "Can edit content" },
    { name: "admin", description: "Can manage users and edit content"}
  ]

  await Promise.all(
    groups.map(group => GroupsService.postGroups(ROOT_ORG_ID, group))
  )
}