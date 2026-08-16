import { supabase } from "./supabase";

export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function logout() {
    await supabase.auth.signOut();
}

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        throw error;
    }

    return data.session;
}

export async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return data.user;
}