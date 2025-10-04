export async function fetchBackend(path: string, method: string, body?: any, headers?: HeadersInit) {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  headers = headers || { "Content-Type": "application/json" }

  const options: RequestInit = {
    method,
    body: body,
    headers,
    credentials: "include",
  }

  let response = await fetch(`${baseURL}/${path}`, options);

  if (response.status === 401) {
    const refreshToken = await fetch(`${baseURL}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    })

    if (refreshToken.ok) {
      response = await fetch(`${baseURL}/${path}`, options);
    } else {
      window.location.href = '/login';
      return refreshToken;
    }
  }

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) return await response.json()

  return response;
} 
