export interface SendResponseInterface<t> {
  status: number
  message: string
  data?: t
}
