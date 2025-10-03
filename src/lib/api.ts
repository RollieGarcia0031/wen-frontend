export async function fetchBackend(path: string, method: string, body?: any, headers?: any) {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  headers = headers || {"Content-Type": "application/json"};

  let response = await fetch(
    `${baseURL}/${path}`,
    {
      method,
      headers,
      body: body,
      credentials: "include",
    }
  );

  if (response.status === 401){
    const tokenResponse = await fetch(`${baseURL}/auth/refresh`, {
      method: "POST",
      headers,
      credentials: "include"
    })

    if (tokenResponse.status === 200 || tokenResponse.success) {
      response = await fetch(
        `${baseURL}/${path}`,
          {
            method,
            headers,
            body: body,
            credentials: "include",
          }
      );
     
    }
  }

  return await response.json();
} 
