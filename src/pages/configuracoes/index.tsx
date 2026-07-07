import styles from "./configuracoes.module.css";

export function Configuracoes() {
    return (
        <div className={styles['container-principal']}>
            <div>
                <h1 className={styles['h1-configuracoes']}>Configurações</h1>
                <h2 className={styles['h2-configuracoes']}>Personalize seu consultório e preferências</h2>
            </div>
            <div className={styles['container-informacoes-pessoais']}>
                <h1 className={styles['h1-informacoes-pessoais']}>Informações Pessoais</h1>

                <div className={styles['formulario-informacoes-pessoais']}>
                    <div className={styles['linha-campo']}>
                        <div className={styles['campo']}>
                            <label htmlFor="nome">Nome completo</label>
                            <input type="text" id="nome" name="nome" placeholder="Digite seu nome" />
                        </div>

                        <div className={styles['campo']}>
                            <label htmlFor="crp">CRP</label>
                            <input type="text" id="crp" name="crp" placeholder="Digite seu CRP" />
                        </div>
                    </div>

                    <div className={styles['linha-campo']}>
                        <div className={styles['campo']}>
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" name="email" placeholder="Digite seu e-mail" />
                        </div>

                        <div className={styles['campo']}>
                            <label htmlFor="telefone">Telefone</label>
                            <input type="tel" id="telefone" name="telefone" placeholder="Digite seu telefone" />
                        </div>
                    </div>

                    <div className={styles['campo-sobre']}>
                        <label htmlFor="sobre">Sobre você</label>
                        <input type="text" id="sobre" name="sobre" placeholder="Conte um pouco sobre você" />
                    </div>
                    <div className={styles['botao-salvar']}>
                        <button type="submit">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        </div>
    )
}