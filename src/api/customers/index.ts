import { GetCustomerDetails, QueryCustomers } from 'dtos'
import { client } from '../client'


export interface FetchAllCustomersParams {
  skip?: number
  take?: number
}

export const fetchAllCustomers = async (params: FetchAllCustomersParams) => {
  const response = await client.api(new QueryCustomers(params))
  return response
}

export interface FetchCustomerDetailsParams {
  id?: string
}

export const fetchCustomerDetails = async (params: FetchCustomerDetailsParams) => {
  const response = await client.api(new GetCustomerDetails(params))
  return response
}
