import fetch from 'isomorphic-unfetch'

export default async function<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)
  if (res.status >= 400) {
    throw new Error("Bad response from server");
  }
  return res.json()
}