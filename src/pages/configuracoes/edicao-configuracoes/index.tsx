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

    function handleChange(
        campo: keyof Usuario,
        valor: string
    ) {
        setUsuario(prev =>
            prev
                ? {
                    ...prev,
                    [campo]: valor
                }
                : prev
        );
    }

    function handleSalvar() {

        if (!usuario) {
            toast.error("Não foi possível carregar os dados do usuário.");
            return;
        }
        const alteracaoUsuario = usuariosService.atualizar(usuario.id_usuario, {
            nome_completo: usuario.nome_completo,
            crp: usuario.crp,
            telefone: usuario.telefone,
            sobre_voce: usuario.sobre_voce
        }).
            then(() => {
                console.log(alteracaoUsuario);
                navigate(-1);
                toast.success("As informações do usuário foram salvas!");
            }).catch((error) => {
                console.error("Erro ao atualizar usuário:", error);
                toast.error("Não foi possível salvar as alterações.");
            })
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
                        placeholder="Digite seu nome"
                        onChange={(e) => handleChange("nome_completo", e.target.value)}
                    />
                    <Input
                        name="CRP"
                        value={usuario?.crp ?? ""}
                        placeholder="Digite seu CRP"
                        onChange={(e) => handleChange("crp", e.target.value)}
                    />
                </div>

                <div className={styles['linha-campo']}>
                    <Input
                        name="E-mail"
                        value={usuario?.email ?? ""}
                        placeholder="Digite seu e-mail" type="email"
                        disabled={true}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                    <Input
                        name="Telefone"
                        value={usuario?.telefone ?? ""}
                        placeholder="Digite seu telefone" type="tel"
                        onChange={(e) => handleChange("telefone", e.target.value)}
                    />
                </div>

                <TextArea
                    name="Sobre você"
                    value={usuario?.sobre_voce ?? ""}
                    placeholder="Conte um pouco sobre você"
                    onChange={(e) => handleChange("sobre_voce", e.target.value)}
                />
                <div className={styles['botao-salvar']}>
                    <Button variant="success" onClick={() => handleSalvar()}>Salvar Alterações</Button>
                </div>
            </Card>
        </div>
    )
}