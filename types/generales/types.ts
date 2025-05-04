export interface SendResponseInterface<t> {
  status: number
  message: string
  data?: t
}

export interface SendResponseSuccessInterface {
  status: number
  message: string
}

export interface SendResponseIndexInterface<T> {
  status: number
  message: string
  data?: PaginationMeta<T>
}

export interface PaginationLinks {
  url: string | null
  label: string
  active: boolean
}

export interface PaginationMeta<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: PaginationLinks[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}
