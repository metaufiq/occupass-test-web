import { GetAllCustomers } from 'dtos'
import { client } from '../client'

export const fetchAllCustomers = async (params = {}) => {
  const response = await client.api(new GetAllCustomers(params))
  return response
}
