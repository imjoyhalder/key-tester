// Relative, same-origin path — proxied to the API by next.config.mjs's
// rewrites() so the session cookie sent with these requests is this app's
// own domain's cookie, not a cross-domain one the browser would drop.
export class ApiClientError extends Error {
  readonly statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    Object.setPrototypeOf(this, ApiClientError.prototype)
  }
}

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const json = await res.json() as { success: boolean; data: T; error?: string }

  if (!res.ok || !json.success) {
    throw new ApiClientError(
      json.error ?? "Request failed",
      res.status
    )
  }

  return json.data
}

export const apiPost = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  })

export const apiGet = <T>(path: string): Promise<T> =>
  request<T>(path)

export const apiPatch = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  })

export const apiDelete = <T>(path: string): Promise<T> =>
  request<T>(path, { method: "DELETE" })

export const apiUpload = async <T>(path: string, file: File): Promise<T> => {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`/api${path}`, {
    method: "POST",
    credentials: "include",
    body: form,
  })
  const json = await res.json() as { success: boolean; data: T; error?: string }
  if (!res.ok || !json.success) {
    throw new ApiClientError(json.error ?? "Upload failed", res.status)
  }
  return json.data
}
