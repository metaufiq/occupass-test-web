import { GetAllCustomers, GetCustomerDetails } from 'dtos'
import { client } from '../client'

export const fetchAllCustomers = async () => {
  const response = await client.api(new GetAllCustomers())
  return response
}

export interface FetchCustomerDetailsParams {
  id?: string
}

export const fetchCustomerDetails = async (params: FetchCustomerDetailsParams) => {
  const response = await client.api(new GetCustomerDetails(params))
  return response
}
