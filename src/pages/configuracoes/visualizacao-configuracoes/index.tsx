import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import styles from "./visualizacao.module.css";
import { useEffect, useState } from "react";
import { usuariosService } from "../../../services/usuarios/usuarios.service";
import { Usuario } from "../../../types/usuarios/usuarios.types";

export function ConfiguracoesVisualizacao() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        async function carregarUsuario() {
            try {
                const usuario = await usuariosService.listar();
                if (usuario.length > 0) {
                    setUsuario(usuario[0]);
                }
                console.log(usuario);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        }
        carregarUsuario();
    }, [])

    return (
        <div className={styles['container-principal']}>
            <div>
                <Header
                    title="Configurações"
                    subtitle="Personalize seu consultório e preferências"
                >
                </Header>
            </div>
            <Card title="Informações Pessoais"
                actions={
                    <Button
                        variant="secondary"
                        icon="edit"
                        onClick={() => navigate("/configuracoes/editar")}
                    >
                        Editar
                    </Button>
                }
            >
                <div className={styles.informacoes}>
                    <Label name="Nome Completo" value={usuario?.nome_completo ?? ""} />
                    <Label name="CRP" value={usuario?.crp ?? ""} />
                    <Label name="E-mail" value={usuario?.email ?? ""} />
                    <Label name="Telefone" value={usuario?.telefone ?? ""} />
                    <Label name="Sobre Você" value={usuario?.sobre_voce ?? ""} />
                </div>
            </Card>
        </div>
    )
}