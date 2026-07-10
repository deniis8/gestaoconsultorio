import { useEffect, useState } from "react";
import { Header } from "../../components/layout/header";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input-comum";
import { TextArea } from "../../components/ui/textArea";
import styles from "./configuracoes.module.css";

import { usuariosService } from "../../services/usuarios/usuarios.service";
import { Usuario } from "../../types/usuarios/usuarios.types";



export function Configuracoes() {

    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        async function carregarUsuario() {
            try{
                const usuario = await usuariosService.listar();
                if(usuario.length > 0){
                    setUsuario(usuario[0]);
                }
                console.log(usuario);
            } catch(error){
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
                    <Button type="submit">Salvar Alterações</Button>
                </div>
            </Card>
        </div>
    )
}