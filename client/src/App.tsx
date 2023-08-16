import { LoggedIn, LoggedOut } from '@slashid/react'
import Dashboard from './Dashboard'
import Login from './Login'

export default function App() {
  return (
    <>
      <LoggedIn>
        <Dashboard />
      </LoggedIn>
      <LoggedOut>
        <Login />
      </LoggedOut>
   </>
  )
}
