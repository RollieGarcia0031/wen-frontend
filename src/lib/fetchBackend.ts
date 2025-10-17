export default async function fetchBackend(
    url: string,
    options?: RequestInit
)
{
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fullUrl = `${baseUrl}/${url}`;

    const response = await fetch(fullUrl, {
        ...options,
        credentials: "include",
    });

    return response;
}