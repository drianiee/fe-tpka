export type PaginationLink = {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export type PaginatedResponse<T> = {
  current_page: number
  data: T[]
  first_page_url?: string | null
  from?: number | null
  last_page: number
  last_page_url?: string | null
  links: PaginationLink[]
  next_page_url?: string | null
  path?: string
  per_page: number
  prev_page_url?: string | null
  to?: number | null
  total: number
}
