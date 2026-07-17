import { useEffect, useState } from "react";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input-comum";
import { TextArea } from "../../../components/ui/textArea";
import styles from "./edicao.module.css";
import { usuariosService } from "../../../services/usuarios/usuarios.service";
import { Usuario } from "../../../types/usuarios/usuarios.types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export function ConfiguracoesEdicao() {

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const navigate = useNavigate();

    function handleSalvar() {
        navigate(-1);
        toast.success("As informações do usuário foram salvas!");
    }

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
                    <Button type="submit" onClick={() => navigate(-1)} icon="back">Voltar</Button>
                </Header>
            </div>
            <Card title="Informações Pessoais">
                <div className={styles['linha-campo']}>
                    <Input
                        name="Nome completo"
                        value={usuario?.nome_completo ?? ""}
                        placeholder="Digite seu nome" />
                    <Input
                        name="CRP"
                        value={usuario?.crp ?? ""}
                        placeholder="Digite seu CRP" />
                </div>

                <div className={styles['linha-campo']}>
                    <Input
                        name="E-mail"
                        value={usuario?.email ?? ""}
                        placeholder="Digite seu e-mail" type="email" />
                    <Input
                        name="Telefone"
                        value={usuario?.telefone ?? ""}
                        placeholder="Digite seu telefone" type="tel" />
                </div>

                <TextArea
                    name="Sobre você"
                    value={usuario?.sobre_voce ?? ""}
                    placeholder="Conte um pouco sobre você" />
                <div className={styles['botao-salvar']}>
                    <Button type="submit" onClick={() => handleSalvar()}>Salvar Alterações</Button>
                </div>
            </Card>
        </div>
    )
}