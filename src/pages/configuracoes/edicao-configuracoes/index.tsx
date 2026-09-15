import { useEffect, useState } from "react";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input-comum";
import { TextArea } from "../../../components/ui/textArea";
import { Loading } from "../../../components/layout/loading";
import styles from "./edicao.module.css";
import { usuariosService } from "../../../services/apis-supabase/usuarios/usuarios.service";
import { Usuario } from "../../../types/usuarios/usuarios.types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SkeletonConfiguracoes } from "../skeleton/skeleton";
import { useAuth } from "../../../hooks/useAuth";


export function ConfiguracoesEdicao() {

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const navigate = useNavigate();
    const [loadingUsuario, setLoadingUsuario] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const { user, loading } = useAuth();

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

    async function handleSalvar() {
        if (!usuario) {
            toast.error("Não foi possível carregar os dados do usuário.");
            return;
        }

        try {
            setSalvando(true);
            await usuariosService.atualizar(usuario.id_usuario, {
                nome_completo: usuario.nome_completo,
                crp: usuario.crp,
                telefone: usuario.telefone,
                sobre_voce: usuario.sobre_voce
            });
            toast.success("As informações do usuário foram salvas!");
            navigate(-1);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            toast.error("Não foi possível salvar as alterações.");
        } finally {
            setSalvando(false);
        }
    }

    useEffect(() => {
        if (loading || !user) return;

        async function carregarUsuario() {
            try {
                setLoadingUsuario(true);
                const usuario = await usuariosService.buscarPorId(user!.id);
                if (usuario.length > 0) {
                    setUsuario(usuario[0]);
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            } finally {
                setLoadingUsuario(false);
            }
        }
        carregarUsuario();
    }, [user, loading])

    return (
        loadingUsuario ? (
            <SkeletonConfiguracoes />) : (
            <>
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
                        <Button variant="success" onClick={() => handleSalvar()} disabled={salvando}>Salvar Alterações</Button>
                    </div>
                </Card>
            </div>
            <Loading loading={salvando} />
            </>)
    )
}