import { FastifySchema, RouteHandlerMethod } from "fastify";
import {
  PersonHandlesService,
  OrganizationsService,
  PersonsService,
} from "../../slashid";
import { env } from "../env";

interface CreateOrgBody {
  name: string
}

export const createOrgSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
}

const { ROOT_ORG_ID } = env();

export const createOrg: RouteHandlerMethod = async (request, reply) => {
  const { name } = request.body as CreateOrgBody
  const { person_id } = request.user as { person_id: string };

  const { result: handles } = await PersonHandlesService.getPersonsPersonIdHandles(person_id, ROOT_ORG_ID)
  if (!handles) {
    reply.code(400);
    return {
      message: "User must have at least one handle",
    };
  }

  type RequestError = { body: Awaited<ReturnType<typeof OrganizationsService.postOrganizationsSuborganizations>> }
  const { result: org, errors } =
    await OrganizationsService.postOrganizationsSuborganizations(
      ROOT_ORG_ID,
      "local_region",
      30,
      {
        admins: [],
        persons_org_id: ROOT_ORG_ID,
        groups_org_id: ROOT_ORG_ID,
        sub_org_name: name,
      }
    )
    .catch((e: RequestError) => e.body)

  const nameConflict = errors?.some(error => error.httpcode === 409)
  if (nameConflict) {
    reply.code(409)
    return {
      message: `Organization '${name}' already exists`
    }
  }

  if (!org) {
    reply.code(400);
    return {
      message: `There was a problem creating the organization`,
    };
  }

  const groups = ["admin"];
  await PersonsService.postPersons(org.id, { handles, groups })

  return {
    message: `Organization '${name}' was created successfully`,
  };
};
