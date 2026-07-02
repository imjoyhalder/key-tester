export interface UserRecord {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface UpdateUserRoleDto {
  userId: string
  role: "admin" | "user"
}

export interface UserListResult {
  users: UserRecord[]
  total: number
}
