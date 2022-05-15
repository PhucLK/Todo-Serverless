import { decode } from 'jsonwebtoken'
import { APIGatewayProxyEvent } from "aws-lambda";

import { JwtToken } from './JwtToken'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtToken
  
  return decodedJwt.sub
}

export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}