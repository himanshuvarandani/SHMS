import React from 'react'

import * as Roles from '../../constants/roles'
import { withAuthorization } from '../Session'

const AdminPage = () => {
  return (
    <div>
      <h1>Admin</h1>
    </div>
  )
}

const condition = (authUser) => authUser && !!authUser.roles[Roles.Admin]

export default withAuthorization(condition)(AdminPage)