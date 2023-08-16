import Fastify from 'fastify'
import { OpenAPI } from '../slashid'
import { join } from 'path'
import fastifyStatic from '@fastify/static'
import { createAuthenticateHook } from './auth'
import { env } from './env'
import { createGroups } from './groups'
import { getDefaultOrg } from './endpoints/get-default-org'
import { addCollaborator, addCollaboratorSchema } from './endpoints/add-collaborator'
import { createOrg } from './endpoints/create-org'

const { ROOT_API_KEY, PORT } = env()
const root = join(__dirname, '../client/dist')
const app = Fastify({ logger: true })

OpenAPI.HEADERS = {
  'SlashID-API-Key': ROOT_API_KEY
}

const { authenticate } = createAuthenticateHook(app)

app.register(fastifyStatic, { root })
app.get('/', (_, reply) => reply.sendFile("index.html"))

app.post('/api/org', { onRequest: [authenticate] }, createOrg)
app.get('/api/default-org', { onRequest: [authenticate] }, getDefaultOrg)
app.post('/api/collaborator', { onRequest: [authenticate], schema: addCollaboratorSchema }, addCollaborator)

const start = async () => {
  try {
    await createGroups()
    
    console.info(`Server is now listening on http://0.0.0.0:${PORT}`)

    await app.listen({ port: PORT, host: "0.0.0.0" })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()