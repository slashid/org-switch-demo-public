import { Groups, OrganizationSwitcher, useSlashID } from "@slashid/react"
import { User } from "@slashid/slashid"
import { button, container, content, root } from "./Dashboard.css"
import { useState } from "react"
import { ADMIN } from '../../shared'

const createOrg = async (user: User, name: string) => {
  const headers: HeadersInit = {
    authorization: `Bearer ${user.token}`,
    "content-type": "application/json"
  }
  const body: BodyInit = JSON.stringify({ name })
  const init: RequestInit = {
    method: 'POST',
    headers,
    body
  }

  const result = await fetch('/api/org', init)

  if (result.ok) {
    alert("Organization created!")
    return
  }

  if (result.status === 409) {
    alert(`Error: organization with ${name} already exists`)
    return
  }

  alert("Error: problem creating organization")
}

const inviteCollaborator = async (user: User, email: string) => {
  const headers: HeadersInit = {
    authorization: `Bearer ${user.token}`,
    "content-type": "application/json"
  }
  const body: BodyInit = JSON.stringify({ email })
  const init: RequestInit = {
    method: 'POST',
    headers,
    body
  }
  
  const result = await fetch('/api/collaborator', init)

  if (result.ok) {
    alert(`${email} added as collaborator`)
    return
  }
  
  alert(`Error: ${(await result.json()).message}`)
}

export default function Dashboard() {
  const { user, logOut } = useSlashID()
  const [orgName, setOrgName] = useState("")
  const [orgCreationInProgress, setOrgCreationInProgress] = useState(false)
  const [email, setEmail] = useState("")
  const [collaboratorInviteInProgress, setCollaboratorInviteInProgress] = useState(false)

  if (!user) return <>Loading...</>

  return (
    <div className={root}>
      <div className={content}>
        <OrganizationSwitcher
          filter={org => org.id !== import.meta.env.VITE_ROOT_ORG_ID}
        />
        <div className={container}>
          <button
            onClick={logOut}
          >
            Logout
          </button>
        </div>
        <div className={container}>
          <label>
            Organisation name
          </label>
          <input
            disabled={orgCreationInProgress}
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
          />
          <button
            className={button}
            disabled={!orgName || orgCreationInProgress}
            onClick={async () => {
              setOrgCreationInProgress(true)
              await createOrg(user, orgName)
              setOrgName("")
              setOrgCreationInProgress(false)
            }}
          >
            Create new organization
          </button>
        </div>
        <Groups belongsTo={groups => groups.includes(ADMIN)}>
          <div className={container}>
            <label>
              Email address
            </label>
            <input
              disabled={collaboratorInviteInProgress}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              className={button}
              disabled={!email || collaboratorInviteInProgress}
              onClick={async () => {
                setCollaboratorInviteInProgress(true)
                await inviteCollaborator(user, email)
                setEmail("")
                setCollaboratorInviteInProgress(false)
              }}
            >
              Invite
            </button>
          </div>
        </Groups>
      </div>
    </div>
  )
}