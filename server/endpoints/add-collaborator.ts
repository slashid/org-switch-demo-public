import { FastifySchema, RouteHandlerMethod } from "fastify";
import { GroupsService, PersonHandleType, PersonsService } from "../../slashid";
import { ADMIN, COLLABORATOR } from '../../shared'
import { env } from "../env";

interface AddCollaboratorBody {
  email: string
}

export const addCollaboratorSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' }
    }
  }
}

const { ROOT_ORG_ID } = env()

export const addCollaborator: RouteHandlerMethod = async (request, reply) => {
  const { email } = request.body as AddCollaboratorBody
  const user = request.user as { person_id: string, oid: string }

  const { result: groups } = await GroupsService.getPersonsPersonIdGroups(user.person_id, user.oid)

  if (!groups.includes(ADMIN)) {
    reply.code(403)
    return {
      message: "Only admins can add collaborator"
    }
  }

  const handle = {
    type: PersonHandleType.EMAIL_ADDRESS,
    value: email
  }

  try {
    // check if the handle exists
    await PersonsService.getPersons(ROOT_ORG_ID, `${handle.type}:${handle.value}`)
  } catch (error) {

    console.log(error, JSON.stringify(error, null, 2))
    reply.code(400)

    return {
      message: `${handle.value} was not found`
    }
  }

  try {
    await PersonsService.postPersons(user.oid, { handles: [handle], groups: [COLLABORATOR] })
  } catch {
    reply.code(400)
    return {
      message: `${handle.value} is already a collaborator`
    }
  }

  return {
    message: `${handle.value} added as collaborator`
  }
}