import { LuCalendar, LuDollarSign, LuLayoutDashboard, LuSettings } from 'react-icons/lu';
import { TbChartInfographic } from 'react-icons/tb';
import { GoPeople } from 'react-icons/go';
import { Link, useLocation } from 'react-router-dom';

import styles from "./menu.module.css";

const opcoes = [
    { label: 'Dashboard', path: '/', icon: <LuLayoutDashboard size={18} /> },
    { label: 'Pacientes', path: '/pacientes', icon: <GoPeople size={18} /> },
    { label: 'Agenda', path: '/agenda', icon: <LuCalendar size={18} /> },
    { label: 'Financeiro', path: '/financeiro', icon: <LuDollarSign size={18} /> },
    { label: 'Relatórios', path: '/relatorios', icon: <TbChartInfographic size={18} /> },
    { label: 'Configurações', path: '/configuracoes', icon: <LuSettings size={18} /> },
];

export function Menu() {
    const location = useLocation();
    
    return (
        <div className={styles['container-menu']}>
            <div className={styles['cabecalho']}>
                <h1 className={styles['h1-menu']}>Cammis</h1>
                <h3 className={styles['h3-menu']}>Gestão de Consultório</h3>
            </div>

            <hr />

            <div className={styles['opcoes']}>
                <ul className={styles['ul-menu']}>
                    {opcoes.map((opcao) => {
                        const isActive = opcao.path === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(opcao.path);

                        return (
                            <li
                                key={opcao.path}
                                className={isActive ? `${styles['li-menu']} ${styles.selected}` : styles['li-menu']}
                            >
                                <Link to={opcao.path}>
                                    {opcao.icon}
                                    <span>{opcao.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div>
                <hr />
                <div className={styles['rodape']}>
                    <h3 className={styles['nome-profissional']}>Camila Patricio</h3>
                    <h4 className={styles['crp']}>CRP: 123456</h4>
                </div>
            </div>
        </div>
    );
}

