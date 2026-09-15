import { useState } from "react";
import { ReceitaMensalDashboard } from "../../../types/dashboard/dashboard.types";
import { formatarMoeda } from "../../../utils/financeiroFormat";
import styles from "./grafico-receita-mensal.module.css";

type GraficoReceitaMensalProps = {
    dados: ReceitaMensalDashboard[];
};

const VIEWBOX_WIDTH = 600;
const VIEWBOX_HEIGHT = 220;
const MARGEM_ESQUERDA = 46;
const MARGEM_DIREITA = 10;
const MARGEM_TOPO = 14;
const LINHA_BASE_Y = 168;
const LINHA_MESES_Y = 196;
const RAIO_BARRA = 4;

const MESES_ABREVIADOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_COMPLETOS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// mes_referencia vem como "yyyy-MM-dd" (date puro) — nunca usar `new Date(...)` aqui,
// pois interpretaria a data como UTC e, lida com getters locais, pode voltar um dia
// em fusos negativos (Brasil é UTC-3). Extrai o mês direto da string.
function extrairMes(dataYYYYMMDD: string): number {
    return Number(dataYYYYMMDD.slice(5, 7)) - 1;
}

function extrairAno(dataYYYYMMDD: string): string {
    return dataYYYYMMDD.slice(0, 4);
}

function caminhoBarraTopoArredondado(x: number, y: number, largura: number, altura: number, raio: number): string {
    if (altura <= 0) return "";
    const r = Math.min(raio, largura / 2, altura);
    return `M ${x},${y + altura} L ${x},${y + r} Q ${x},${y} ${x + r},${y} L ${x + largura - r},${y} Q ${x + largura},${y} ${x + largura},${y + r} L ${x + largura},${y + altura} Z`;
}

export function GraficoReceitaMensal({ dados }: GraficoReceitaMensalProps) {
    const [indiceAtivo, setIndiceAtivo] = useState<number | null>(null);

    const valorMaximo = Math.max(1, ...dados.map((d) => d.valor_recebido));
    const larguraUtil = VIEWBOX_WIDTH - MARGEM_ESQUERDA - MARGEM_DIREITA;
    const alturaUtil = LINHA_BASE_Y - MARGEM_TOPO;
    const larguraSlot = dados.length > 0 ? larguraUtil / dados.length : larguraUtil;
    const larguraBarra = larguraSlot * 0.5;

    const barras = dados.map((item, index) => {
        const x = MARGEM_ESQUERDA + index * larguraSlot + (larguraSlot - larguraBarra) / 2;
        const alturaBarra = (item.valor_recebido / valorMaximo) * alturaUtil;
        const y = LINHA_BASE_Y - alturaBarra;
        const centroX = x + larguraBarra / 2;

        return { ...item, x, y, alturaBarra, centroX };
    });

    const itemAtivo = indiceAtivo != null ? barras[indiceAtivo] : null;

    return (
        <div className={styles.container}>
            <svg
                className={styles.svg}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                preserveAspectRatio="none"
            >
                <line x1={MARGEM_ESQUERDA} y1={MARGEM_TOPO} x2={VIEWBOX_WIDTH - MARGEM_DIREITA} y2={MARGEM_TOPO} className={styles.grade} />
                <line x1={MARGEM_ESQUERDA} y1={LINHA_BASE_Y} x2={VIEWBOX_WIDTH - MARGEM_DIREITA} y2={LINHA_BASE_Y} className={styles.grade} />

                <text x={MARGEM_ESQUERDA - 6} y={MARGEM_TOPO + 4} textAnchor="end" className={styles["eixo-label"]}>
                    {formatarMoeda(valorMaximo)}
                </text>
                <text x={MARGEM_ESQUERDA - 6} y={LINHA_BASE_Y} textAnchor="end" className={styles["eixo-label"]}>
                    R$ 0,00
                </text>

                {barras.map((barra, index) => (
                    <g key={barra.mes_referencia}>
                        <path
                            d={caminhoBarraTopoArredondado(barra.x, barra.y, larguraBarra, barra.alturaBarra, RAIO_BARRA)}
                            className={`${styles.barra} ${indiceAtivo === index ? styles.ativa : ""}`}
                            onMouseEnter={() => setIndiceAtivo(index)}
                            onMouseLeave={() => setIndiceAtivo(null)}
                        />
                        <text
                            x={barra.centroX}
                            y={LINHA_MESES_Y}
                            className={`${styles["mes-label"]} ${indiceAtivo === index ? styles.ativa : ""}`}
                        >
                            {MESES_ABREVIADOS[extrairMes(barra.mes_referencia)]}
                        </text>
                    </g>
                ))}
            </svg>

            {itemAtivo && (
                <div
                    className={styles.tooltip}
                    style={{
                        left: `${(itemAtivo.centroX / VIEWBOX_WIDTH) * 100}%`,
                        top: `${(itemAtivo.y / VIEWBOX_HEIGHT) * 100}%`
                    }}
                >
                    {formatarMoeda(itemAtivo.valor_recebido)}
                    <span className={styles["tooltip-mes"]}>
                        {MESES_COMPLETOS[extrairMes(itemAtivo.mes_referencia)]} de {extrairAno(itemAtivo.mes_referencia)}
                    </span>
                </div>
            )}
        </div>
    );
}
