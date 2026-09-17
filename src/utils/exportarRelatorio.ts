import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export type ColunaRelatorio = { header: string; key: string };

export function exportarParaExcel(
    nomeArquivo: string,
    colunas: ColunaRelatorio[],
    linhas: Record<string, unknown>[]
): void {
    const dados = linhas.map((linha) => {
        const objeto: Record<string, unknown> = {};
        colunas.forEach((coluna) => {
            objeto[coluna.header] = linha[coluna.key] ?? "";
        });
        return objeto;
    });

    const planilha = XLSX.utils.json_to_sheet(dados);
    const livro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(livro, planilha, "Relatório");
    XLSX.writeFile(livro, `${nomeArquivo}.xlsx`);
}

export function exportarParaPdf(
    nomeArquivo: string,
    titulo: string,
    subtitulo: string,
    colunas: ColunaRelatorio[],
    linhas: Record<string, unknown>[],
    rodape?: string
): void {
    const documento = new jsPDF();

    documento.setFontSize(14);
    documento.text(titulo, 14, 16);
    documento.setFontSize(10);
    documento.text(subtitulo, 14, 23);

    autoTable(documento, {
        startY: 30,
        head: [colunas.map((coluna) => coluna.header)],
        body: linhas.map((linha) => colunas.map((coluna) => String(linha[coluna.key] ?? ""))),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [109, 74, 255] }
    });

    if (rodape) {
        const finalY = (documento as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
        documento.setFontSize(10);
        documento.text(rodape, 14, finalY);
    }

    documento.save(`${nomeArquivo}.pdf`);
}
