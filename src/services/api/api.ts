import { supabase } from "../auth/supabase";

const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log(API_URL);

export async function api<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {

    const {
        data: { session },
        error
    } = await supabase.auth.getSession();

    if (error) {
        throw new Error(`Erro ao obter sessão: ${error.message}`);
    }

    if (!session) {
        throw new Error("Usuário não autenticado.");
    }

    console.log("Usuário:", session.user.id);
    console.log("Access Token:", session.access_token);


    const response = await fetch(`${API_URL}/rest/v1/${endpoint}`, {
        ...options,
        headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${session?.access_token ?? API_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
            ...options?.headers
        }
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}