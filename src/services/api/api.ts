const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log(API_URL);

export async function api<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {

    const response = await fetch(`${API_URL}/rest/v1/${endpoint}`, {
        headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}