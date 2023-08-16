import fastifyJwt, { Secret, TokenOrHeader } from "@fastify/jwt"
import { FastifyInstance, FastifyRequest, onRequestHookHandler } from "fastify"
import buildGetJwks from "get-jwks"

export const createAuthenticateHook = (app: FastifyInstance) => {
  const API_ENDPOINT = process.env.API_ENDPOINT!
  const getJwks = buildGetJwks()
    
  const secret: Secret = async (request: FastifyRequest, token: TokenOrHeader) => {  
    if (!('header' in token)) throw Error()

    const { kid, alg } = token.header

    return getJwks
      .getPublicKey({ kid, domain: API_ENDPOINT, alg })
  }

  app.register(fastifyJwt, {
    decode: { complete: true },
    secret
  })

  const authenticate: onRequestHookHandler = async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  }

  return {
    authenticate
  }
}