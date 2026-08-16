import {
    LuCalendar,
    LuDollarSign,
    LuLayoutDashboard,
    LuSettings
} from 'react-icons/lu';
import { BsBox2 } from "react-icons/bs";
import { TbChartInfographic } from 'react-icons/tb';
import { GoPeople } from 'react-icons/go';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RxExit } from "react-icons/rx";

import styles from "./menu.module.css";
import { logout } from '../../../services/auth/authService';

export function Menu() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        return path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div className={styles['container-menu']}>

            {/* Cabeçalho */}
            <div className={styles['cabecalho']}>
                <h1 className={styles['h1-menu']}>
                    Cammis
                </h1>

                <h3 className={styles['h3-menu']}>
                    Gestão de Consultório
                </h3>
            </div>

            <hr />

            {/* Opções do menu */}
            <div className={styles['opcoes']}>

                <ul className={styles['ul-menu']}>

                    {/* Dashboard */}
                    <li
                        className={
                            isActive('/dashboard')
                                ? `${styles['li-menu']} ${styles.selected}`
                                : styles['li-menu']
                        }
                    >
                        <Link to="/dashboard">
                            <LuLayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {/* Pacientes */}
                    <li
                        className={
                            isActive('/pacientes')
                                ? `${styles['li-menu']} ${styles.selected}`
                                : styles['li-menu']
                        }
                    >
                        <Link to="/pacientes">
                            <GoPeople size={18} />
                            <span>Pacientes</span>
                        </Link>
                    </li>

                    {/* Agenda */}
                    <li
                        className={
                            isActive('/agenda')
                                ? `${styles['li-menu']} ${styles.selected}`
                                : styles['li-menu']
                        }
                    >
                        <Link to="/agenda">
                            <LuCalendar size={18} />
                            <span>Agenda</span>
                        </Link>
                    </li>

                    {/* Financeiro */}
                    <li
                        className={
                            isActive('/financeiro')
                                ? `${styles['li-menu']} ${styles.selected}`
                                : styles['li-menu']
                        }
                    >
                        <Link to="/financeiro">
                            <LuDollarSign size={18} />
                            <span>Financeiro</span>
                        </Link>
                    </li>

                    {/* Planos de Cobrança */}
                    <li
                        className={
                            isActive('/planos-cobranca')
                                ? `${styles['li-menu']} ${styles.selected}`
                                : styles['li-menu']
                        }
                    >
                        <Link to="/planos-cobranca">
                            <BsBox2 size={18} />
                            <span>Planos de Cobrança</span>
                        </Link>
                    </li>

                    {/* Relatórios */}
                    <li
                        className={
                            isActive('/relatorios')
                                ? `${styles['li-menu']} ${styles.selected}`
                                : styles['li-menu']
                        }
                    >
                        <Link to="/relatorios">
                            <TbChartInfographic size={18} />
                            <span>Relatórios</span>
                        </Link>
                    </li>

                    {/* Configurações */}
                    <li
                        className={
                            isActive('/configuracoes')
                                ? `${styles['li-menu']} ${styles.selected}`
                                : styles['li-menu']
                        }
                    >
                        <Link to="/configuracoes">
                            <LuSettings size={18} />
                            <span>Configurações</span>
                        </Link>
                    </li>

                    {/* Sair */}
                    <li
                        className={
                            isActive('/')
                                ? `${styles['li-menu']} ${styles.selected}`
                                : styles['li-menu']
                        }
                    >
                        <Link
                            to="/"
                            onClick={handleLogout}
                        >
                            <RxExit size={18} />
                            <span>Sair</span>
                        </Link>

                    </li>

                </ul>

            </div>

            {/* Rodapé */}
            <div>
                <hr />

                <div className={styles['rodape']}>
                    <h3 className={styles['nome-profissional']}>
                        Camila Patricio
                    </h3>

                    <h4 className={styles['crp']}>
                        CRP: 123456
                    </h4>
                </div>
            </div>

        </div>
    );
}