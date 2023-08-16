import { RouteHandlerMethod } from "fastify";
import {
  PersonAttributesService,
  PersonHandlesService,
  OrganizationsService,
  PersonsService,
} from "../../slashid";
import { env } from "../env";
import { Group } from "../../shared";

const { ROOT_ORG_ID } = env();

export const getDefaultOrg: RouteHandlerMethod = async (request, reply) => {
  const END_USER_NO_ACCESS = "end_user_no_access";
  const { person_id } = request.user as { person_id: string };

  const [{ result: attrs }, { result: handles }] = await Promise.all([
    PersonAttributesService.getPersonsPersonIdAttributes(
      person_id,
      ROOT_ORG_ID
    ),
    PersonHandlesService.getPersonsPersonIdHandles(person_id, ROOT_ORG_ID),
  ]);

  const defaultOrgId = attrs?.[END_USER_NO_ACCESS]?.default_org_id;
  if (defaultOrgId) return { defaultOrgId };

  if (!handles) {
    reply.code(400);
    return {
      message: "User must have at least one handle",
    };
  }

  const { result: org } =
    await OrganizationsService.postOrganizationsSuborganizations(
      ROOT_ORG_ID,
      "local_region",
      30,
      {
        admins: [],
        persons_org_id: ROOT_ORG_ID,
        groups_org_id: ROOT_ORG_ID,
        sub_org_name: `${handles[0].value.split("@")[0]}'s organization`,
      }
    );

  if (!org) {
    reply.code(400);
    return {
      message: "There was a problem creating your default org",
    };
  }

  const groups: Group[] = ["collaborator"];
  const attributes = {
    [END_USER_NO_ACCESS]: { default_org_id: org.id },
  };

  await Promise.all([
    PersonsService.postPersons(org.id, { handles, groups }),
    PersonAttributesService.putPersonsPersonIdAttributes(
      person_id,
      ROOT_ORG_ID,
      attributes
    ),
  ]);

  return {
    defaultOrgId: org.id,
  };
};
