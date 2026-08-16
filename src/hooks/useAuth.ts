import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../services/auth/supabase";
import { getSession } from "../services/auth/authService";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function carregarSessao() {
            try {
                const session = await getSession();

                setUser(session?.user ?? null);
            } catch (error) {
                console.error("Erro ao recuperar sessão:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        carregarSessao();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };

    }, []);

    return {
        user,
        loading,
    };
}