import { GetOrders } from 'dtos'
import { client } from '../client'

export interface FetchOrdersParams {
  page?: number
  customerId?: string
}

export const fetchOrders = async (params?:FetchOrdersParams) => {
  const response = await client.api(new GetOrders(params))
  return response
}
