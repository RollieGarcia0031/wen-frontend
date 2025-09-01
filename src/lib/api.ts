export async function fetchBackend(path: string, method: string, body?: any, headers?: any) {
  const baseURL = "http://localhost:8080";
  
  headers = headers || {"Content-Type": "application/json"};

  const response = await fetch(
    `${baseURL}/${path}`,
    {
      method,
      headers,
      body: body,
      credentials: "include",
    }
  );

  return await response.json();
} 