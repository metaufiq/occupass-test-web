import { JsonServiceClient } from '@servicestack/client'

export const client = new JsonServiceClient('https://uitestapi.occupass.com')

client.requestFilter = (req) => {
  req.credentials = 'omit'
  return req
}
