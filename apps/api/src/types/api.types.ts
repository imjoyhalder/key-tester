export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  statusCode: number
  details?: string[]
}

export interface PaginationQuery {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
