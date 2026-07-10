import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { Usuario } from "../../types/usuarios/usuarios.types";

export class UsuariosService {

    async listar(): Promise<Usuario[]> {

        return api<Usuario[]>(ENDPOINTS.usuarios);
    }

    async buscarPorEmail(email: string): Promise<Usuario[]> {

        return api<Usuario[]>(
            `${ENDPOINTS.usuarios}?email=eq.${encodeURIComponent(email)}`
        );
    }

    async buscarPorId(id: number): Promise<Usuario[]> {

        return api<Usuario[]>(
            `${ENDPOINTS.usuarios}?id_usuario=eq.${id}`
        );
    }

    async inserir(usuario: Omit<Usuario, "id_usuario">): Promise<Usuario[]> {

        return api<Usuario[]>(ENDPOINTS.usuarios, {
            method: "POST",
            body: JSON.stringify(usuario)
        });
    }

    async atualizar(id: number, usuario: Partial<Usuario>) {

        return api<Usuario[]>(
            `${ENDPOINTS.usuarios}?id_usuario=eq.${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(usuario)
            }
        );
    }

    async excluir(id: number) {

        return api<void>(
            `${ENDPOINTS.usuarios}?id_usuario=eq.${id}`,
            {
                method: "DELETE"
            }
        );
    }
}

export const usuariosService = new UsuariosService();