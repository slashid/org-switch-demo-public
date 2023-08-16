
import '@slashid/react/style.css'
import { Form, ConfigurationProvider, defaultOrganization } from "@slashid/react"
import { User } from "@slashid/slashid"
import { root, content } from "./Login.css"

const getDefaultOrgId = async (user: User) => {
  const headers: HeadersInit = {
    authorization: `Bearer ${user.token}`
  }

  const result = await fetch('/api/default-org', { headers })
  const { defaultOrgId } = await result.json() 

  return defaultOrgId
}


export default function Login() {
  return (
    <ConfigurationProvider
      factors={[
        { method: "email_link" }
      ]}
      text={{
        "initial.title": "Welcome to SlashID Notes",
        "initial.handle.phone.email": "Type your email address",
        "authenticating.retryPrompt": "Didn’t receive the link?",
        "authenticating.retry": "Resend",
        "success.subtitle": "You will be redirected shortly.",
      }}
    >
      <div className={root}>
        <div className={content}>
          <Form
            middleware={[
              defaultOrganization(async ({ user }) => {
                const defaultOrgId = await getDefaultOrgId(user)

                return defaultOrgId
              })
            ]}
          />
        </div>
      </div>
    </ConfigurationProvider>
  )
}