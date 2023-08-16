import 'dotenv/config'

export const env = () => {
  const variables = {
    ROOT_ORG_ID: process.env.VITE_ROOT_ORG_ID!,
    ROOT_API_KEY: process.env.ROOT_API_KEY!,
    API_ENDPOINT: process.env.API_ENDPOINT!,
    PORT: parseInt(process.env.PORT!)
  }

  for (const [key, value] of Object.entries(variables)) {
    if (value === undefined || value === "") throw new Error(`${key} is required`)
  }

  return variables
}