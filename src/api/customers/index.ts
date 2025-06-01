import { GetAllCustomers } from 'dtos'
import { client } from '../client'

export const fetchAllCustomers = async () => {
  const response = await client.api(new GetAllCustomers())
  return response
}
